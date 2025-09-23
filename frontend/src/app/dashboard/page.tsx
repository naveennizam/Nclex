'use client'

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthFetch } from '@/app/utils/authFetch';
import RingLoaderSpin from '../../components/gui/spinner';


export default function DashboardPage() {
  const { user, loading, isLoggedIn, accessToken } = useAuth();
  const router = useRouter();
  const fetchWithAuth = useAuthFetch();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn || !user) {
        console.log("🔁 Redirecting to login...");
        router.push("/");
      } else {
        setReady(true); 
      }
    }
  }, [loading, isLoggedIn, user, router]);

  if (!ready) {
    return <RingLoaderSpin />;
  }

  return (
    <div>
    <h3>Welcome</h3>
    <p>Go to the Create test</p>
    
  </div>
  );
}
