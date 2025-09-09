'use client'
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthFetch } from '@/app/utils/authFetch';

export default function DashboardPage() {
    //  const { accessToken } = useAuth();
    const { accessToken, loading } = useAuth();
console.log( "accessToken",  accessToken, "loading",loading)
    const router = useRouter();


    const fetchWithAuth = useAuthFetch();

    useEffect(() => {

        const getProfile = async () => {
            const isDev = process.env.NEXT_PUBLIC_Phase === 'development';
            const domain = isDev ? process.env.NEXT_PUBLIC_Backend_Domain : '';
    
            const res = await fetchWithAuth(`${domain}/auth/profile`);
          //  const data = await res.json();
        };

        if (accessToken) {
            getProfile();
        }
    }, [accessToken]);

    useEffect(() => {
        if (!loading && !accessToken) {
            // No token even after refresh attempt
          //  router.push('/');
          console.log("not working")

        }
    }, [loading, accessToken]);

    if (loading) return <p>🔄 Loading...</p>; // Block render

    return (
        <div>
            <h1>✅ Protected Dashboard</h1>
            <p>Your token is valid</p>
        </div>
    );
}
