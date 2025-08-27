import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import  "../styles/global.scss"
// import SessionWrapper from "@/components/providers/SessionWrapper"
import Header from "@/components/layouts/Header";

import Footer from "@/components/layouts/Footer";
import BootstrapClient from "@/components/layouts/BootstrapClient";
// import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from '@/app/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NCLEX preparation",
  description: "Learn and Grow",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased` } suppressHydrationWarning={true}>
       <AuthProvider>
        <BootstrapClient />
        <Header />
        {children}
        <Footer />
        </AuthProvider>
      </body>

    </html>
  );
}
