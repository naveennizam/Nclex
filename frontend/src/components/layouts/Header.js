"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { ShoppingCart } from "./ShoppingCart";
// import { useAppSelector } from "../../../store/redux";
// import { useSession, signOut } from "next-auth/react";
import dynamic from "next/dynamic";


const Header = () => {
    //   let CartItemsLength = useAppSelector((state) => state.cart.items);
    let [total, setTotal] = useState(0);

    const pathname = usePathname();

    // const { data: session, status } = useSession();
    let status = 'unauthenticated'

    const [login, setLogin] = useState('unauthenticated');

    // const Modal = dynamic(() => import('./Modal'), {
    //     ssr: false
    // });

    let subTotal = 0;
    useEffect(() => {
        let status = 'unauthenticated'
        setLogin(status);

        // for (let i = 0; i < CartItemsLength.length; i++) {
        //   subTotal = subTotal + CartItemsLength[i].quantity;
        // }
        // setTotal(subTotal);
    }, [total]);

    const [isOpen, setIsOpen] = useState(false);

    const showModal = () => {
        const { Modal } = require("bootstrap");
        const myModal = new Modal("#exampleModal");
        myModal.show();
    };

    const openCart = async () => {
        pathname != "/cart" ? setIsOpen(!isOpen) : location.reload();
    };

    //   const handleChange = (arg) => setIsOpen(false);
    return (
        <>

            {pathname == "/checkout" && (
                <>
                    <nav className="navbar navbar-expand-lg ">
                        <div className="container-fluid m-4">
                            <Link legacyBehavior href="/">
                                <a className="logo d-flex align-items-center me-auto">
                                    <Image
                                        src="/img/anmol_name.jpg"
                                        alt="ANMOL LOGO"
                                        width={180}
                                        height={50}
                                        priority={true}
                                        loading="eager"
                                        style={{ width: "auto", height: "auto" }}
                                    />
                                </a>
                            </Link>







                        </div>
                    </nav>
                </>
            )}
            {pathname != "/checkout" && (
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
                                        <a className="nav-link" aria-current="page" href="/new-in">
                                            NCLEX-RN
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a
                                            className="nav-link"
                                            aria-current="page"
                                            href="/women"
                                            data-toggle="tab"
                                        >
                                            NCLEX-PN                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" aria-current="page" href="/suit">
                                            Pricing
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" aria-current="page" href="/contact-us">
                                            Testimonials
                                        </a>
                                    </li>

                                    <li className="nav-item"><div class="dropdown">
                                        <button class="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Resources
                                        </button>
                                        <div class="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton">
                                            <a class="dropdown-item text-light" href="#">Study Guide Books</a>
                                            <a class="dropdown-item text-light" href="#">NCLEX preparation Questions</a>
                                            <a class="dropdown-item text-light" href="#">Simple Nursing Blog</a>
                                        </div>
                                    </div></li>
                                    {/* <li>
                                        <span className=" favt">
                                            <a
                                                className="nav-link"
                                                aria-current="page"
                                                href="/wishlist"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                                                </svg>
                                            </a>
                                        </span>
                                    </li> */}
                                </ul>
                            </div>




                            {/* {status == "authenticated" && (
                <>

                  {session.user.name == "email_credientials" &&
                    <a href="/account">
                      <button >  <span
                        width={40}
                        height={40}
                        className=" primary-btn  mx-2 p-3 company-header-avatar "

                      >
                        {session.user.image}
                      </span></button>
                    </a>
                  }

                  {session.user.name != 'email_credientials' && <div className="company-header-avatar" onClick={() => (window.location.href = '/account')} style={{ backgroundImage: `url(${session.user.image})` }}></div>}

                </>
              )} */}
                            <button class="btn btn-primary" type="button" onClick={showModal}>Sign In </button>
                            {/* <button
                                onClick={openCart}
                                style={{
                                    width: "2.5rem",
                                    height: "2.5rem",
                                    position: "relative",
                                }}
                                variant="outline-primary"
                                className="rounded-circle"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    fill="currentColor"
                                    style={{ color: "white", fontSize: "30px" }}
                                >
                                    <path d="M96 0C107.5 0 117.4 8.19 119.6 19.51L121.1 32H541.8C562.1 32 578.3 52.25 572.6 72.66L518.6 264.7C514.7 278.5 502.1 288 487.8 288H170.7L179.9 336H488C501.3 336 512 346.7 512 360C512 373.3 501.3 384 488 384H159.1C148.5 384 138.6 375.8 136.4 364.5L76.14 48H24C10.75 48 0 37.25 0 24C0 10.75 10.75 0 24 0H96zM128 464C128 437.5 149.5 416 176 416C202.5 416 224 437.5 224 464C224 490.5 202.5 512 176 512C149.5 512 128 490.5 128 464zM512 464C512 490.5 490.5 512 464 512C437.5 512 416 490.5 416 464C416 437.5 437.5 416 464 416C490.5 416 512 437.5 512 464z" />
                                </svg>

                                <div
                                    className="rounded-circle bg-danger d-flex justify-content-center align-items-center"
                                    style={{
                                        color: "white",
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        transform: "translate(25%, 25%)",
                                    }}
                                >
                                    
                                    {(total = total == undefined ? 0 : total)}
                                </div>
                            </button> */}

                        </div>
                    </nav>
                    {/* <div id="cart">
            {isOpen && <ShoppingCart handleChange={handleChange} />}
          </div> */}
                </>
            )}

            {/* <Modal /> */}
        </>
    );
};

export default Header;

