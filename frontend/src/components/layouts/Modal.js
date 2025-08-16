"use client"
import Image from 'next/image'
import { usePathname, useRouter } from "next/navigation";
import { useSession, getSession, signIn } from 'next-auth/react';
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';


const Modal = () => {

  let { status } = useSession();
  // const status = useSession();

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

    if (!email || !email.includes('@') || !password)
      return alert('Invalid details');

    setLogging(true);

    const stat = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
    });

    setLogging(false);
    if (stat.error)
      return alert(stat.error);


    window.location.reload()

  }

  const register = async (e) => {

    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !email.includes('@') || !password || !userName)
      return alert('Invalid details');

    setLogging(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        // country: country
      }),
    });

    setLogging(false);

    const data = await res.json();

    if (res.status != 201 || res.status != 200) return alert(data.message)

    const status = await signIn('credentials', {
      //  redirect: false,
      email: email,
      password: password,
    });
    if (status.error) return alert(status.error);



    window.location.reload();


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
  const signByGoogle = () => {
    console.log("fdghjghfddfb")
    signIn("google")
  }
  return (
    <>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">

          <div className="modal-content postion-relative rounded-0">


            <div className="modal-body p-0">
              <nav>
                <div className="nav nav-tabs nav-justified" id="nav-tab" role="tablist">



                  {forgetPWD && (
                    <>
                      <button className="nav-link active rounded-0" id="nav-forgot-tab" data-bs-toggle="tab" data-bs-target="#nav-forgot"
                        type="button" role="tab" aria-controls="nav-forgot" aria-selected="false">Forgot Password</button>
                    </>)}
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent">
                {!forgetPWD && (
                  <>
                    {!logIn && (
                      <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"
                        tabindex="0">
                        <div class="row g-0 align-items-center">

                          <div className="col-md-12 col-lg-12">
                            <div className=" p-4">
                              <div className="text-center">
                                <div className="mb-3">
                                  <h4 className="card-title">LOGIN</h4>
                                </div>
                              </div>
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
                                      <i className="bi-eye-slash"></i>
                                    </span>
                                    <span className="invalid-feedback">Please enter a valid password.</span>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-center mb-2">
                                  <span className="form-label-link" style={{ cursor: "pointer" }} onClick={() => setForgetPWD(true)}>Forgot Password?</span>
                                </div>
                                <div className="d-grid gap-4">
                                  <button type="submit" className="btn primary-btn" disabled={logging ? true : false}>Sign in</button>

                                  <div className="d-flex justify-content-center">
                                    <span> OR</span>
                                  </div>

                                </div>
                              </form>

                              <div className='d-flex mb-2'>
                                <button style={{ display: "flex", alignItems: "center" }} className="btn btn-white border rounded-pill flex-fill justify-content-center" onClick={signByGoogle}>
                                  <Image src="/img/svg/google-logo.svg" alt="" width={30} height={30} />Sign in Google
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
                        tabindex="0">
                        <form id="register-form" onSubmit={register} method="post" >
                          <div class="row g-0 align-items-center">

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
                                      <i className="bi-eye-slash"></i>
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
                      tabindex="0">
                      <form name="forget-pwd-form" onSubmit={forgotPassword} method="post" >
                        <div class="row g-0 align-items-center bg-primary">

                          <div className="col-md-12 col-lg-6">
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