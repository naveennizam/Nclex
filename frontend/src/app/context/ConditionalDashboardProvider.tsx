'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layouts/DashboardHeader';


export  function CoonditionalDashboardProvider() {
  const pathname = usePathname();
  const hideOnRoutes = ['/dashboard/result/test','/dashboard/test'];

  const shouldHide = hideOnRoutes.some((path) => pathname.startsWith(path));

  return shouldHide ? null : <Header />;
}


