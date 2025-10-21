
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/gui/ThemeToggle';
import AdminShell from './guard/AdminShell';
import { ReactNode } from "react";
import "../../styles/admin.css";
import {CoonditionalDashboardProvider} from "@/app/context/ConditionalDashboardProvider";

interface DashboardClientLayoutProps {
  children: ReactNode;
}

export default function DashboardClientLayout({ children }: DashboardClientLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      storageKey="nclex-theme"
      value={{ light: 'light', dark: 'dark', system: "system" }}
      disableTransitionOnChange
    >
      <ThemeToggle />

      <SidebarProvider defaultOpen={true}>
        <AdminShell>
          <CoonditionalDashboardProvider />
          <main>
            {children}
          </main>
        </AdminShell>
      </SidebarProvider>
    </ThemeProvider>
  );
}
