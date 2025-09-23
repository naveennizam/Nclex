"use client";
import { AppSidebar } from "@/components/gui/app-sidebar"
import { usePathname } from 'next/navigation';
import { ReactNode } from "react";

interface AdminShellProps {
    children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {

    const pathname = usePathname();
    const hideOnRoutes = ['/dashboard/test'];

    const shouldHide = hideOnRoutes.some((path) => pathname.startsWith(path));


    if (shouldHide) return <>{children}</>;

    return (

        <div className="flex h-full">
            <AppSidebar />
            <main className="flex-1">{children}</main>
        </div>

    );
}
