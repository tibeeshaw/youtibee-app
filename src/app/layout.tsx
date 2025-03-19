import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextAuthProvider from "./context/NextAuthProvider";
import { StoreProvider } from "./context/StoreProvider";
import "./globals.css";
import Navbar from "./navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTibee",
  description: "Browse and download your youtube videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-FR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <NextAuthProvider>
            <Navbar />
            {children}
          </NextAuthProvider>
          {/* <VercelAnalytics /> */}
          <SpeedInsights />
        </StoreProvider>
      </body>
    </html>
  );
}
