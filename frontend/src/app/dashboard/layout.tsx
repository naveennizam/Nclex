
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/gui/ThemeToggle';
import AdminShell from './AdminShell';
import { ReactNode } from "react";
import "../../styles/admin.css";
import {CoonditionalDashboardProvider} from "@/app/context/ConditionalDashboardProvider";

interface DashboardClientLayoutProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function DashboardClientLayout({ children, defaultOpen }: DashboardClientLayoutProps) {
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
