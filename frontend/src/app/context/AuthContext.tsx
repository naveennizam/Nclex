// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect ,ReactNode  } from 'react';
import { useRouter } from "next/navigation";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();


  const [isLoggedIn, setIsLoggedIn] =useState<boolean>(false);
  useEffect(() => {


    const getNewAccessToken = async () => {
      try {
        const isDev = process.env.NEXT_PUBLIC_Phase === 'development';
        const domain = isDev ? process.env.NEXT_PUBLIC_Backend_Domain : '';

        const res = await fetch(`${domain}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
        });

        const data = await res.json();
        if (res.ok) {
          setAccessToken(data.access_token);
          setIsLoggedIn(true)
        }
      } catch (e) {
        setAccessToken(null);

      } finally {
        setLoading(false);
        
      }
    };

    getNewAccessToken();

  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''

      fetch(`${domain}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Refresh failed');
          return res.json(); // ← Add this
        })
        .then((data) => {
          if (data.access_token) {
            setAccessToken(data.access_token);
            setIsLoggedIn(true);
          }
        })

        .catch(() => {
          // ❌ Token refresh failed — logout
          setAccessToken(null);         // clear memory token
          setIsLoggedIn(false);
          router.push('/');           // redirect to login page
        });
    }, 25 * 60 * 1000); // refresh every 25 min

    return () => clearInterval(interval);
  }, []);
  const logout = async () => {
    setAccessToken(null);
    setIsLoggedIn(false);

    let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
    const res = await fetch(`${domain}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ Must be present to allow cookie to be saved
     
    });
    router.push('/');
  };
  
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading, setLoading, isLoggedIn ,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};