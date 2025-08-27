"use client"
import Image from 'next/image'
import { usePathname, useRouter } from "next/navigation";
import { useSession, getSession, signIn } from 'next-auth/react';
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useAuth } from '../../app/context/AuthContext';


const Modal = () => {

  // let { status } = ffv();
  // // const status = useSession();

  const [logIn, setLogIn] = useState(false);

  const [logging, setLogging] = useState(false);
  const [forgetPWD, setForgetPWD] = useState(false);
  const [userName, setUserName] = useState('')
  const router = useRouter();
  const pathname = usePathname();



  const login = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
      const res = await fetch(`${domain}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Must be present to allow cookie to be saved
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        setLogging(false);

        window.location.href = '/dashboard';

      }
      if (!res.ok) {
        let errorShow = document.querySelector("#errorShow")
        errorShow.style.display = 'block'
      }

    } catch (error) {
      console.error(error)
    }
  };

  const register = async (e) => {

    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !email.includes('@') || !password || !userName)
      return alert('Invalid details');

    setLogging(true);
    try {
      let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
      const res = await fetch(`${domain}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Must be present to allow cookie to be saved
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          // country: country
        }),
      });

      setLogging(false);

      const data = await res.json();

      if (res.ok && data.access_token) {
        // 👇 Handle redirect client-side only
        window.location.href = '/dashboard';
      }
      if (!res.ok) {
        alert(data.message)
      }

    } catch (error) {
      console.error(error)
    }

    //  window.location.reload();

  }

  const forgotPassword = async (e) => {

    e.preventDefault();

    const email = e.target.email.value.trim();

    if (!email || !email.includes('@'))
      return alert('Invalid email address');

    const form = document.querySelector('[name="forget-pwd-form"]');

    const formData = new FormData(form);

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.status != 201)
      return alert(data.message)

    //console.log(data.message)

    if (res.status == 201) {
      alert(data.message)
      router.reload()
    }
    else {
      alert('An error occured. Please try again!')
    }
  }


  const togglePasswordLogin = async (e) => {
    let password = document.querySelector('#login-form [name="password"]');
    password.type = password.type == 'password' ? 'text' : 'password';
  }

  const togglePasswordRegister = async (e) => {
    let password = document.querySelector('#register-form [name="password"]');
    password.type = password.type == 'password' ? 'text' : 'password';
  }

  const handleUserName = (e) => {
    if (e.target.value.match("^[a-zA-Z ]*$") != null) {
      setUserName(e.target.value);
    }
  }


  useEffect(() => {
  }, [userName])
  
  const signByGoogle = async () => {

    let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''

    window.location.href = `${domain}/auth/google`;
  }
  return (
    <>

      <div className="modal fade" data-bs-theme="dark" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">

          <div className="modal-content postion-relative rounded-0">


            <div className="modal-body p-0">
              {/* name of site */}

              <nav>
                <div className="nav nav-tabs nav-justified" id="nav-tab" role="tablist">
                  <div className="modal-title w-100 text-center" id="exampleModalLabel">
                    <p>
                      <img src='/images/icon1.png' /><br />
                      <strong>Sign in to NCLEX</strong><br />
                      <em>Welcome back! Please sign in to continue</em>
                    </p>

                  </div>




                  {forgetPWD && (
                    <>
                      <button className="nav-link active rounded-0" id="nav-forgot-tab" data-bs-toggle="tab" data-bs-target="#nav-forgot"
                        type="button" role="tab" aria-controls="nav-forgot" aria-selected="false">Forgot Password</button>
                    </>)}
                </div>
              </nav>
              {/* name of site */}

              {/*  logIn and forget password */}
              <div className="tab-content" id="nav-tabContent">
                {!forgetPWD && (
                  <>
                    {!logIn && (
                      <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"
                        tabIndex="0">
                        <div className="row g-0 align-items-center">

                          <div className="col-md-12 col-lg-12">
                            <div className=" p-4">
                              <p style={{ display: "none", color: "red" }} id='errorShow'>Invalid credentials</p>
                              <form id="login-form" onSubmit={login} method="post">
                                <div className="my-2">
                                  <input type="email" className="form-control text-muted form-control-lg rounded-0 border"
                                    name="email" placeholder="email@address.com" maxLength={50} required />
                                  <span className="invalid-feedback">Please enter a valid email address.</span>
                                </div>
                                <div className="mb-2">
                                  <div className="position-relative">
                                    <input type="password"
                                      className="form-control text-muted form-control-lg rounded-0 border" name="password"
                                      minLength={8}
                                      maxLength={12}
                                      placeholder="min. 8 characters required" required />
                                    <span onClick={togglePasswordLogin} style={{ cursor: "pointer" }} className="position-absolute top-50 end-0 translate-middle me-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                      </svg>
                                    </span>

                                    <span className="invalid-feedback">Please enter a valid password.</span>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-center mb-2">
                                  <span className="form-label-link " style={{ cursor: "pointer" }} onClick={() => setForgetPWD(true)}>Forgot Password?</span>
                                </div>
                                <div className="d-grid gap-4">
                                  <button type="submit" className="btn btn-primary" disabled={logging ? true : false}>Sign in</button>

                                  <div className="d-flex justify-content-center">
                                    <span> OR</span>
                                  </div>

                                </div>
                              </form>

                              <div className='d-flex mb-2'>
                                <button style={{ display: "flex", alignItems: "center" }} className="btn btn-white border rounded-pill flex-fill justify-content-center" onClick={signByGoogle}>
                                  <Image src="/images/svg/google-logo.svg" alt="" width={30} height={30} />Sign in Google
                                </button>
                              </div>
                              <p className="card-text text-muted text-center " onClick={() => setLogIn(true)} >Don't have an account yet? <a className="link"
                                style={{ cursor: "pointer" }}>Sign Up</a>
                              </p>

                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {logIn && (
                      <div className="tab-pane fade  show active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"
                        tabIndex="0">
                        {/* <form id="register-form" onSubmit={register} method="post" > */}

                        {/* Register form */}
                        <form id="register-form" onSubmit={register} method="post" >

                          <div className="row g-0 align-items-center">

                            <div className="col-md-12 col-lg-12">
                              <div className=" p-3">
                                <div className="text-center">
                                  <div className="mb-3">
                                    <h4 className="card-title">Create an Account</h4>
                                  </div>

                                </div>
                                <div className="my-2">
                                  <input type="text" className="form-control text-muted form-control-lg rounded-0 border"
                                    name="name" maxLength={30} placeholder="Your Full Name" onChange={handleUserName} value={userName} required />

                                </div>
                                <div className="mb-2">
                                  <input type="email" className="form-control text-muted form-control-lg rounded-0 border"
                                    name="email" id="signinSrEmail" placeholder="email@address.com" maxLength={50} required />
                                  <span className="invalid-feedback">Please enter a valid email address.</span>
                                </div>
                                <div className="mb-2">
                                  <div className="position-relative">
                                    <input type="password" className="form-control text-muted form-control-lg rounded-0 border" name="password"
                                      minLength={8}
                                      maxLength={12}
                                      id="signupSrPassword" placeholder="8+ characters required" required />
                                    <span onClick={togglePasswordRegister} style={{ cursor: "pointer" }} className="position-absolute top-50 end-0 translate-middle me-2"
                                      href="javascript:;">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                      </svg>
                                    </span>
                                    <span className="invalid-feedback">Please enter a valid password.</span>
                                  </div>
                                </div>

                                <div className="d-grid gap-2">
                                  <button type="submit" className="btn primary-btn" disabled={logging ? true : false}>Sign up</button>

                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-center">
                            <span  > OR</span>
                          </div>
                        </form>

                        <div className='d-flex'>
                          <button style={{ display: "flex", alignItems: "center" }} className="btn btn-white border rounded-pill flex-fill justify-content-center" onClick={signByGoogle}>
                            <Image src="/img/svg/google-logo.svg" alt="" width={30} height={30} />Sign in Google
                          </button>
                        </div>

                        <p className="card-text text-muted text-center my-3" onClick={() => setLogIn(false)} >Already have an account? <a className="link"
                          style={{ cursor: "pointer" }}>Login here</a>
                        </p>
                      </div>

                    )}
                  </>)}


                {forgetPWD && (
                  <>
                    <div className="tab-pane fade active show" id="nav-forgot" role="tabpanel" aria-labelledby="nav-forgot-tab"
                      tabIndex="0">
                      <form name="forget-pwd-form" onSubmit={forgotPassword} method="post" data-bs-theme="dark">
                        <div className="row g-0 align-items-center ">

                          <div className="col-md-12 col-lg-6" >
                            <div className=" p-4">
                              <div className="mb-4 text-center">
                                <p className="card-title">Please enter email address of your account and we will send you a link in email to reset your password.</p>
                              </div>
                              <div className="mb-4">
                                <input type="email" className="form-control text-muted form-control-lg rounded-0 border"
                                  name="email" id="signinSrEmail" placeholder="email@address.com" maxLength={50} required />
                                <span className="invalid-feedback">Please enter a valid email address.</span>
                              </div>
                              <div className="d-grid gap-4">
                                <button type="submit" className="btn primary-btn" disabled={logging ? true : false}>Submit</button>
                                <p className="card-text text-muted text-center"><span className="link" style={{ cursor: "pointer" }} onClick={() => setForgetPWD(false)}>Back to Sign In</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </>)}
              </div>
            </div>


          </div>
        </div >
      </div >

    </>
  );
}

export default Modal