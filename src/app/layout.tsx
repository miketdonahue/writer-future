import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { DetailPaneProvider } from "@/components/detail-pane-context";
import { Toaster } from "@/components/ui/sonner";
import { TrpcProvider } from "@/trpc/TrpcProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
    <html lang="en" className={poppins.variable}>
      <body className={`${geistMono.variable} antialiased`}>
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
