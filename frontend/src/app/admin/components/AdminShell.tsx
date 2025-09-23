"use client";

 import { SidebarProvider } from "@/components/ui/old_sidebar";
 import { AppSidebar } from "./AppSidebar";


export default function AdminShell({ children }: { children: React.ReactNode }) {  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
