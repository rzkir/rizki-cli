"use client";

import React, { Fragment } from "react";

import { usePathname } from "next/navigation";

import Header from "@/helper/header/Header";

import Footer from "@/helper/footer/Footer";

import { Toaster } from "sonner";

const Pathname = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isRoute =
    pathname?.includes("/signin") ||
    pathname?.includes("/signup") ||
    pathname?.includes("/forget-password") ||
    pathname?.includes("/verification") ||
    pathname?.includes("/change-password") ||
    pathname?.includes("/reset-password") ||
    pathname?.includes("/profile/") ||
    pathname?.includes("/dashboard") ||
    false;

  return (
    <Fragment>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 3000,
          className: "font-medium",
        }}
      />
      {!isRoute && <Header />}
      {children}
      {!isRoute && <Footer />}
    </Fragment>
  );
};

export default Pathname;
