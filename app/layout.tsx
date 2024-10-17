import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Rubik's 3D Solver",
  description: "Rubik's Cube Solver - Scan your cube with an smartphone and get a simple step-by-step 3D explanation.",
  authors: [{ name: "Braigue Aziz", url: "https://github.com/braigX" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("bg-background font-sans antialiased", fontSans.variable)}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
