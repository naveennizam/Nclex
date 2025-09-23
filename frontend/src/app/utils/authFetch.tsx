// utils/authFetch.ts

// React Custom hook
import { useAuth } from '@/app/context/AuthContext';

export const useAuthFetch = () => {
  const {accessToken} = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    return fetch(url, { ...options, headers });
  };
};