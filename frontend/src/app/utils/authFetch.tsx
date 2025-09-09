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
console.log("header",headers,"url",url)
    return fetch(url, { ...options, headers });
  };
};

// const fetchWithAuth = async (url, options = {}) => {
//   let res = await fetch(url, {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   if (res.status === 401) {
//     // try refresh token
//     const refreshRes = await fetch('/auth/refresh-token', {
//       method: 'POST',
//       credentials: 'include',
//     });

//     if (refreshRes.ok) {
//       const data = await refreshRes.json();
//       setAccessToken(data.access_token); // from context
//       // retry original request
//       res = await fetch(url, {
//         ...options,
//         headers: {
//           ...options.headers,
//           Authorization: `Bearer ${data.access_token}`,
//         },
//       });
//     }
//   }

//   return res;
// };

