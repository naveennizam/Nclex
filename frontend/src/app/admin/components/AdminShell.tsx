"use client";

 import { SidebarProvider } from "@/app/admin/components/UI/sidebar";
 import { AppSidebar } from "./AppSidebar";


export default function AdminShell({ children }: { children: React.ReactNode }) {  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
