import type { Metadata } from "next";
import "./globals.css";
import { manrope } from "@/utils";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import ClerkContext from "@/components/common/ClerkContext";

export const metadata: Metadata = {
  title: "Ucademy",
  description: "Nền tảng học lập trình trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkContext>
      <html lang="en" suppressHydrationWarning>
        <body className={manrope.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkContext>

  );
}
