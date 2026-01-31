import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { DetailPaneProvider } from "@/components/detail-pane-context";
import { Toaster } from "@/components/ui/sonner";
import { TrpcProvider } from "@/trpc/TrpcProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Writer Future",
  description: "A modern app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TrpcProvider>
          <DetailPaneProvider>
            <AppShell>{children}</AppShell>
          </DetailPaneProvider>
        </TrpcProvider>
        <Toaster />
      </body>
    </html>
  );
}
