interface UserAccount {
  uid: string;
  email: string;
  image?: string;
  displayName: string;
  updatedAt: Date;
  createdAt: Date;
}

interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserAccount>;
  signup: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<UserAccount>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  getDashboardUrl: () => string;
  forgotPassword: (email: string) => Promise<void>;
  showInactiveModal: boolean;
  setShowInactiveModal: (show: boolean) => void;
  isLoading: boolean;
  resetPasswordEmail: string | null;
  isVerifyingOTP: boolean;
  verifyOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  resetOTPState: () => void;
  isResettingPassword: boolean;
  resetPassword: (
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
  updateProfileImage: (imageUrl: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  updateDisplayName: (displayName: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
}
