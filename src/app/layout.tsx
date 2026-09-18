import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CoreverseProvider } from "@/providers/coreverse-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coreverse Engine",
  description: "A modern game engine website.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: true,
};

const RootLayout = ({
                      children,
                    }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
    >
    <body className="flex min-h-screen flex-col bg-background font-sans text-foreground">
    <CoreverseProvider>{children}</CoreverseProvider>
    </body>
    </html>
  );
};

export default RootLayout;
