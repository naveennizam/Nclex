import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
//import  "../styles/global.scss"
// import SessionWrapper from "@/components/providers/SessionWrapper"
import Header from "@/components/layouts/Header";
import { ThemeProvider } from 'next-themes';
import Footer from "@/components/layouts/Footer";
import BootstrapClient from "@/components/layouts/BootstrapClient";
import 'bootstrap/dist/css/bootstrap.min.css';
 import ThemeToggle from '@/components/ui/ThemeToggle'
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
  description: 'A Learning Management System',
  manifest: '/manifest.json', 

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
       <ThemeProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem = {true}
        storageKey="nclex-theme"
        value={{ light: 'light', dark: 'dark',system :"system" }}
        disableTransitionOnChange>
          <ThemeToggle/>
      <BootstrapClient />
         <AuthProvider>
        <Header />
        {children}
        <Footer />
        </AuthProvider>
        </ThemeProvider>
      </body>

    </html>
  );
}
