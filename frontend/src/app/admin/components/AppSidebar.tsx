"use client";

import Link from "next/link";
import {adminRoutes} from '../../../components/providers/config/admin-routes'


export function AppSidebar() {
  return (
    <aside className="w-64 border-r min-h-screen p-4">
      <ul className="space-y-2">
        {adminRoutes.map((item) => (
          <li key={item.title}>
            <Link href={item.url} className="flex items-center gap-2 hover:text-blue-600">
              <item.icon size={18} />
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
