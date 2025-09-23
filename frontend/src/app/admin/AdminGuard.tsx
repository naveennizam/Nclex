'use client';

import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import  RingLoaderSpin  from '../../components/gui/spinner';



const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until user is loaded
    if (!loading && user && user.role !== 'admin')  router.push('/');
    
  }, [user, loading]);

  if (loading || !user) {
    return <RingLoaderSpin/>;
  }

  // If user is admin, show children
  return <>{children}</>;
};

export default AdminGuard;
