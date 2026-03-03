"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/Firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { toast } from "sonner";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const router = useRouter();

  // Signin state
  const [isLoading, setIsLoading] = useState(false);

  // OTP state
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string | null>(
    null,
  );
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  // Change password state
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const getDashboardUrl = () => {
    return "/dashboard";
  };

  const handleRedirect = () => {
    const redirectUrl = localStorage.getItem("redirectAfterLogin");
    if (redirectUrl) {
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectUrl);
      return;
    }
    router.push("/dashboard");
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<UserAccount> => {
    try {
      if (!email || !password) {
        throw new Error("Email dan password harus diisi");
      }

      setIsLoading(true);

      const emailString = String(email).trim();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailString,
        password,
      );

      const userDoc = await getDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string,
          userCredential.user.uid,
        ),
      );
      const userData = userDoc.data() as UserAccount;

      if (!userData) {
        throw new Error("User account not found");
      }

      // Get Firebase auth token and create session
      // API session masih digunakan untuk membuat session cookie
      const idToken = await userCredential.user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      setUser(userData);
      const welcomeMessage = getWelcomeMessage(userData);
      toast.success(welcomeMessage);

      setIsLoading(false);
      handleRedirect();

      return userData;
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        // Check if the error is due to disabled account
        if (error.message.includes("auth/user-disabled")) {
          setShowInactiveModal(true);
        } else {
          toast.error("Login gagal: " + error.message);
        }
      } else {
        toast.error("Terjadi kesalahan saat login");
      }
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<UserAccount> => {
    try {
      if (!email || !password || !displayName) {
        throw new Error("Email, password, dan nama harus diisi");
      }

      const emailString = String(email).trim();
      const displayNameString = String(displayName).trim();

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailString,
        password,
      );

      // Get Firebase auth token
      const idToken = await userCredential.user.getIdToken();

      // Create user document in Firestore via API
      const createUserResponse = await fetch("/api/auth/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          email: emailString,
          displayName: displayNameString,
        }),
      });

      if (!createUserResponse.ok) {
        const errorData = await createUserResponse.json();
        throw new Error(errorData.error || "Failed to create user account");
      }

      const { user: userData } = await createUserResponse.json();

      // Create session
      await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      setUser(userData as UserAccount);
      const welcomeMessage = getWelcomeMessage(userData as UserAccount);
      toast.success(welcomeMessage);
      handleRedirect();

      return userData as UserAccount;
    } catch (error) {
      if (error instanceof Error) {
        // Handle Firebase Auth errors
        if (error.message.includes("auth/email-already-in-use")) {
          toast.error(
            "Email sudah terdaftar. Silakan gunakan email lain atau login.",
          );
        } else if (error.message.includes("auth/weak-password")) {
          toast.error(
            "Password terlalu lemah. Gunakan password yang lebih kuat.",
          );
        } else if (error.message.includes("auth/invalid-email")) {
          toast.error("Format email tidak valid.");
        } else {
          toast.error("Signup gagal: " + error.message);
        }
      } else {
        toast.error("Terjadi kesalahan saat signup");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      setUser(null);

      // Clear the session cookie through an API call
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important: This ensures cookies are included
      });

      // Clear any stored redirect URLs
      localStorage.removeItem("redirectAfterLogin");

      // Force reload the page to clear any remaining state
      window.location.href = "/signin";

      toast.success("Anda berhasil logout");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Terjadi kesalahan saat logout");
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        throw new Error("Failed to get authentication token");
      }

      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete account");
      }

      setUser(null);
      toast.success("Akun berhasil dihapus");
      router.push("/signin");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus akun",
      );
      throw error;
    }
  };

  const getWelcomeMessage = (userData: UserAccount): string => {
    const { displayName } = userData;
    return `Selamat datang, ${displayName}!`;
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      if (!email || email.trim() === "") {
        throw new Error("Email harus diisi");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Format email tidak valid");
      }

      const emailString = email.trim();

      // Send OTP for password reset via forgot-password API
      const otpResponse = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailString }),
      });

      const data = await otpResponse.json();

      if (!otpResponse.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      // Store email in state and localStorage
      setResetPasswordEmail(emailString);
      localStorage.setItem("resetPasswordEmail", emailString);

      toast.success(
        "Kode reset password telah dikirim ke email Anda. Silakan cek inbox.",
      );
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("No account found") ||
          error.message.includes("tidak terdaftar")
        ) {
          toast.error("Tidak ada akun dengan email ini.");
        } else {
          toast.error("Gagal mengirim kode reset: " + error.message);
        }
      } else {
        toast.error("Gagal mengirim kode reset.");
      }
      throw error;
    }
  };

  const verifyOTP = async (otp: string): Promise<void> => {
    try {
      if (!resetPasswordEmail) {
        throw new Error("Email tidak ditemukan. Silakan mulai dari awal.");
      }

      if (!otp || otp.length !== 6) {
        throw new Error("OTP harus 6 digit");
      }

      setIsVerifyingOTP(true);

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetPasswordEmail,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memverifikasi OTP");
      }

      toast.success("OTP berhasil diverifikasi");
      // Redirect to change password page
      router.push("/change-password");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Gagal memverifikasi OTP");
      }
      throw error;
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const resendOTP = async (): Promise<void> => {
    try {
      if (!resetPasswordEmail) {
        throw new Error("Email tidak ditemukan");
      }

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetPasswordEmail }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal mengirim ulang OTP");
      }

      toast.success("OTP telah dikirim ulang ke email Anda");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Gagal mengirim ulang OTP");
      }
      throw error;
    }
  };

  const resetOTPState = () => {
    setResetPasswordEmail(null);
    setIsVerifyingOTP(false);
    localStorage.removeItem("resetPasswordEmail");
  };

  const updateProfileImage = async (imageUrl: string): Promise<void> => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile image");
      }

      const { user: updatedUser } = await response.json();
      setUser(updatedUser as UserAccount);
      toast.success("Foto profil berhasil diperbarui");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui foto profil",
      );
      throw error;
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/auth/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to upload image");
    }

    if (!data?.url) {
      throw new Error("No URL returned from upload");
    }

    await updateProfileImage(data.url);
    return data.url;
  };

  const updateDisplayName = async (newDisplayName: string): Promise<void> => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const name = newDisplayName.trim();
      if (!name) {
        throw new Error("Nama tidak boleh kosong");
      }

      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update display name");
      }

      const { user: updatedUser } = await response.json();
      setUser(updatedUser as UserAccount);
      toast.success("Nama berhasil diperbarui");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui nama",
      );
      throw error;
    }
  };

  const resetPassword = async (
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> => {
    try {
      if (!resetPasswordEmail) {
        throw new Error("Email tidak ditemukan");
      }

      if (!newPassword || !confirmPassword) {
        throw new Error("Password harus diisi");
      }

      if (newPassword.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Password tidak cocok");
      }

      setIsResettingPassword(true);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetPasswordEmail,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mereset password");
      }

      toast.success("Password berhasil direset");
      // Reset OTP state first (but keep email in localStorage until redirect completes)
      // This prevents useEffect in ChangePassword from triggering redirect
      setResetPasswordEmail(null);
      setIsVerifyingOTP(false);
      // Use window.location for hard redirect (component will unmount)
      // Clear localStorage after redirect starts
      window.location.href = "/signin";
      // Clean up localStorage after redirect
      setTimeout(() => {
        localStorage.removeItem("resetPasswordEmail");
      }, 100);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Gagal mereset password");
      }
      throw error;
    } finally {
      setIsResettingPassword(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    try {
      if (!user?.email) {
        throw new Error("No user logged in");
      }

      if (!currentPassword || !newPassword) {
        throw new Error("Password saat ini dan password baru harus diisi");
      }

      if (newPassword.length < 6) {
        throw new Error("Password baru minimal 6 karakter");
      }

      const emailString = String(user.email).trim();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailString,
        currentPassword,
      );
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengubah password");
      }

      toast.success("Password berhasil diubah");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("auth/wrong-password") ||
          error.message.includes("auth/invalid-credential")
        ) {
          toast.error("Password saat ini salah");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Gagal mengubah password");
      }
      throw error;
    }
  };

  // Load reset password email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetPasswordEmail");
    if (storedEmail) {
      setResetPasswordEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS) {
          const userDoc = await getDoc(
            doc(
              db,
              process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string,
              firebaseUser.uid,
            ),
          );
          const userData = userDoc.data() as UserAccount;
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    deleteAccount,
    getDashboardUrl,
    forgotPassword,
    showInactiveModal,
    setShowInactiveModal,
    // Signin state
    isLoading,
    // OTP state
    resetPasswordEmail,
    isVerifyingOTP,
    verifyOTP,
    resendOTP,
    resetOTPState,
    // Change password state
    isResettingPassword,
    resetPassword,
    updateProfileImage,
    uploadAvatar,
    updateDisplayName,
    changePassword,
  };
  return (
    <AuthContext.Provider value={value as AuthContextType}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
