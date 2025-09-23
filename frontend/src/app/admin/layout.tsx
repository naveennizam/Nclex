import { redirect } from 'next/navigation';
import AdminShell from "./components/AdminShell";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/admin/components/AppSidebar";
import { useAuth } from '@/app/context/AuthContext';
import { useAuthFetch } from '@/app/utils/authFetch';

import { cookies } from 'next/headers';
import AdminGuard from './AdminGuard'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  // const token = await cookies().get('refresh_token')?.value;
  // console.log("token,token",await cookies(),token)
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"


  console.log("🧱 Admin Layout rendered");

  return (
    <AdminGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </AdminGuard>
  );
}
