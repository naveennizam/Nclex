"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import { useAuth } from '../../app/context/AuthContext';

import { useAuthFetch } from '@/app/utils/authFetch';



const Header = () => {


    const pathname = usePathname();
    const { isLoggedIn, logout, accessToken } = useAuth();
    let [userProfile, setUserProfile] = useState([])
    let [loading, setLoading] = useState(false)

    const Modal = dynamic(() => import('./Modal'), {
        ssr: false
    });


    const showModal = () => {
        const { Modal } = require("bootstrap");
        const myModal = new Modal("#exampleModal");
        myModal.show();

    };
    const fetchWithAuth = useAuthFetch();

    useEffect(() => {

        const getProfile = async () => {
            const isDev = process.env.NEXT_PUBLIC_Phase === 'development';
            const domain = isDev ? process.env.NEXT_PUBLIC_Backend_Domain : '';

            const res = await fetchWithAuth(`${domain}/auth/profile`);
            const data = await res.json();
            setUserProfile(data)
            setLoading(true)
            console.log('👤 User Profile:', data.name[0].toUpperCase());
        };

        if (accessToken) {
            getProfile();
        }
    }, [accessToken]);
    console.log(userProfile)

    return (
        <>

            <>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                    <div className="container-fluid mx-4">
                        <Link className="logo d-flex align-items-center me-auto" href="/">

                            <Image
                                src="/images/icon1.png"
                                alt="NCLEX LOGO"
                                width={180}
                                height={50}
                                priority={true}
                                loading="eager"
                                style={{ width: "auto", height: "auto" }}
                            />

                        </Link>

                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div
                            className="collapse navbar-collapse "
                            id="navbarSupportedContent"
                        >
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-4">
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page" href="/nclex-rn">
                                        NCLEX-RN
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        aria-current="page"
                                        href="/nclex-pn"
                                        data-toggle="tab"
                                    >
                                        NCLEX-PN                                        </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page" href="/pricing">
                                        Pricing
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page" href="/testimonials">
                                        Testimonials
                                    </a>
                                </li>

                                <li className="nav-item"><div className="dropdown">
                                    <button className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Resources
                                    </button>
                                    <div className="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item text-light" href="books">Study Guide Books</a>
                                        <a className="dropdown-item text-light" href="questions">NCLEX preparation Questions</a>
                                        <a className="dropdown-item text-light" href="blog">Simple Nursing Blog</a>
                                    </div>
                                </div></li>

                            </ul>
                        </div>

                        {isLoggedIn && loading ? (
                            <>
                                {/* <div className="w-10 h-10 rounded-full overflow-hidden bg-white text-black flex items-center justify-center font-semibold text-sm uppercase">
                    
                                {userProfile.image ? (
                                    
                                    <img
                                        src={userProfile.image}
                                        alt={userProfile.name}
                                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                      
                                        class="w-100 h-100 object-fit-cover rounded-circle"
                                    />
                                ) : (
                                    userProfile.name[0].toUpperCase()
                                )}
                               </div> */}
                                <div
                                    className="rounded-circle overflow-hidden"
                                    style={{ width: '40px', height: '40px' }}
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
                                            className="w-100 h-100 object-fit-cover rounded-circle"
                                        />
                                    ) : null}

                                    <div
                                        className="w-100 h-100 d-flex align-items-center justify-content-center bg-white text-black fw-bold rounded-circle text-uppercase"
                                        style={{ display: userProfile.image ? 'none' : 'flex' }}
                                    >
                                        {userProfile.name[0].toUpperCase()}
                                    </div>
                                </div>

                                <button onClick={logout}>Logout</button>
                            </>
                        ) : (<button className="btn btn-primary" type="button" onClick={showModal}>Sign In </button>
                        )}


                    </div>
                </nav>

            </>
            .
            <Modal />
        </>
    );
};

export default Header;

