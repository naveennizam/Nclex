
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, Github, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import Divider from '../ui/Divider'
import dynamic from "next/dynamic";
import { useAuth } from '../../app/context/AuthContext';

import { useAuthFetch } from '@/app/utils/authFetch';


const links = [
  { href: '/docs', label: 'Docs' },
  { href: '/learn', label: 'Learn' },
  { href: '/practice', label: 'Practice' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { isLoggedIn, logout, accessToken } = useAuth();
  let [userProfile, setUserProfile] = useState([])
  let [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false);
 

  const Modal = dynamic(() => import('./Modal'), {
    ssr: false
  });


  const fetchWithAuth = useAuthFetch();

  useEffect(() => {

    const getProfile = async () => {
      const isDev = process.env.NEXT_PUBLIC_Phase === 'development';
      const domain = isDev ? process.env.NEXT_PUBLIC_Backend_Domain : '';

      const res = await fetchWithAuth(`${domain}/auth/profile`);
      const data = await res.json();
      setUserProfile(data)
      setLoading(true)
    };

    if (accessToken) {
      getProfile();
    }
  }, [accessToken]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {}, [showModal]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (<>
    <>
      <header className="header">


        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link href="/" className=" font-semibold text-lg">
            ▲ NCLEX
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex gap-8">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="group relative text-sm text-neutral-300 hover:text-white transition-colors">
                {label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${pathname === href ? 'scale-x-100' : ''
                    }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
          

            {mounted && (
              <button
                onClick={toggleTheme}
                className={`p-1 rounded transition-colors ${theme === 'system'
                  ? 'bg-gray-700 text-white hover:bg-gray-800 dark:bg-neutral-500 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-800'
                  : theme === 'dark'
                    ? ' bg-neutral-500 text-white hover:bg-neutral-600'
                    : 'bg-gray-700 text-white hover:bg-gray-800'
                  }`}
                aria-label="Toggle theme"
              >
                {theme === 'light' && <Moon size={18} />}
                {theme === 'dark' && <Sun size={18} />}
                {theme === 'system' && <Monitor size={18} />} 
              </button>
            )}

          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && loading ? (
              <>
                <div
                  className="w-10 h-10 rounded-full overflow-hidden relative"
                >
                  {userProfile.image ? (
                    <img
                      src={userProfile.image}
                      alt={userProfile.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : null}

                  {/* Fallback avatar with initials */}
                  <div
                    className="w-full h-full flex items-center justify-center bg-white text-black font-bold rounded-full uppercase"
                    style={{ display: userProfile.image ? 'none' : 'flex' }}
                  >
                    {userProfile.name?.[0]}
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="button-primary"
                onClick={() => setShowModal(true)}
              >
                Sign In
              </button>
            )}
          </div>

        </div>
        <Divider />

      </header >
    {showModal && <Modal onClose={() => setShowModal(false)} theme="system"/>}
    </>

  </>
  );
}
