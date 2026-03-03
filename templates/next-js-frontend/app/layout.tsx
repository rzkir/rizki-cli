import type { Metadata } from "next";

import "@/helper/style/globals.css";

import { geistMono, geistSans } from "@/helper/fonts/Fonts";

import { metadata as baseMetadata } from "@/helper/meta/Metadata";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
