import "@/helper/style/globals.css";

import { geistMono, geistSans } from "@/helper/fonts/Fonts";

import { metadata } from "@/helper/meta/Metada";

import Providers from "@/helper/routing/Provider";

export { metadata };

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
