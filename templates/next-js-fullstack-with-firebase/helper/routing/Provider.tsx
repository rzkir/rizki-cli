"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/context/AuthContext";

import Pathname from "@/helper/routing/Pathname";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Pathname>{children}</Pathname>
      </AuthProvider>
    </QueryClientProvider>
  );
}
