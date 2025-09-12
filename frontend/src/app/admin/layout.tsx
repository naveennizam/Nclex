import { redirect } from 'next/navigation';
import AdminShell from "./components/AdminShell";
import { SidebarProvider } from "@/app/admin/components/UI/sidebar";
import { AppSidebar } from "@/app/admin/components/AppSidebar";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = { role: 'admin' }; // Simulated user

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  console.log("🧱 Admin Layout rendered"); // Should only run once on first load

  return (
    <SidebarProvider>
    <AppSidebar />
    {children}
  </SidebarProvider>
  );
}
