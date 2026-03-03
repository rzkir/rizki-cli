import "@/helper/style/globals.css";

import { fontClassName } from "@/helper/fonts/Fonts";

import { metadata } from "@/helper/meta/Metadata";

export { metadata };

import Providers from "@/helper/routing/Provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontClassName}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
