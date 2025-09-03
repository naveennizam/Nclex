"use client"
import Image from 'next/image'
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from 'next-themes';


const Modal = ({ onClose }) => {

  const [logIn, setLogIn] = useState(false);
  const [logging, setLogging] = useState(false);
  const [forgetPWD, setForgetPWD] = useState(false);
  const [userName, setUserName] = useState('')
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!email || !email.includes('@') || !password)
      return alert('Invalid details');

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
    console.log(password)
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
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true); // Make sure this only renders on client
  }, []);

  if (!mounted) return null;
  // const color = resolvedTheme === 'dark' ? '#292828' : '#ede8e8'; // red-500 or neutral-500
  const color = resolvedTheme === 'system' ? 'text-gray-800' : resolvedTheme === 'dark' ? '#292828' : '#ede8e8'

  return (
    <>

      <div
        id="authModal"
        className="fixed inset-0 flex items-center justify-center z-50 transition-colors "
        role="dialog"
        aria-labelledby="authModalLabel"
        style={{ backgroundColor: color }}
      >

        {/* Overlay */}
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
        // onClick={onClose}
        ></div>

        {/* Modal Content */}
        <div
          className="relative z-50  rounded-lg shadow-lg w-full max-w-2xl p-6"
          style={{ backgroundColor: color }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2  text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center space-y-2 border-b pb-4 mb-4">
            <img src="/images/icon1.png" alt="Logo" className="mx-auto h-12" />
            <h2 id="authModalLabel" className="text-2xl font-semibold">
              Sign in to NCLEX
            </h2>
            <p className="text-sm italic text-gray-500 dark:text-gray-400">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-4">
            {!forgetPWD ? (
              <>
                <button
                  className={`px-4  py-2 mx-2 ${!logIn ? 'button-primary' : 'selection-button'}`}
                  onClick={() => setLogIn(false)}
                > Sign In
                </button>
                <button
                  className={`px-4 py-2 mx-2 ${logIn ? 'button-primary' : 'selection-button'}`}

                  onClick={() => setLogIn(true)}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => setLogIn(false)}
              >
                Back to Sign In
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div>
            {/* Sign In */}
            {!forgetPWD && !logIn && (
              <form id="login-form" onSubmit={login} method="post" className="space-y-4" >
                <p style={{ display: "none", color: "red" }} id='errorShow'>Invalid credentials</p>

                <input
                  type="email"
                  name="email"
                  placeholder="email@address.com"
                  maxLength={50}
                  required
                  className="w-full px-3 py-2 my-3  rounded-md input-field "

                />
                <span className="invalid-feedback">Please enter a valid email address.</span>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="min. 8 characters"
                    minLength={8}
                    maxLength={12}
                    required
                    className="w-full px-3 py-2 rounded-md input-field "
                  />
                  <span onClick={togglePasswordLogin} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                    </svg>
                  </span>
                  <span className="invalid-feedback">Please enter a valid password.</span>
                </div>
                <div className="flex justify-end">
                  <span
                    onClick={() => setForgetPWD(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer"
                  >
                    Forgot password?
                  </span>
                </div>
                <button type="submit" disabled={logging} className="w-full button-primary disabled:opacity-50">
                  Sign In
                </button>
                <div className="py-2 text-center">OR</div>
                <div className='d-flex mb-2'>
                  <button onClick={signByGoogle}
                    className="w-full flex items-center justify-center py-2 gap-2 button-google ">
                    <Image src="/images/svg/google-logo.svg" alt="" width={30} height={30} />Sign in Google
                  </button>
                </div>

              </form>



            )}

            {/* Sign Up */}
            {!forgetPWD && logIn && (
              <form id="register-form" onSubmit={register} method="post" className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name"
                  value={userName}
                  onChange={handleUserName}
                  required
                  className="w-full px-3 py-2 my-1 rounded-md input-field"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="email@address.com"
                  required
                  className="w-full px-3 py-2 my-1  rounded-md input-field"
                />
                <span className="invalid-feedback">Please enter a valid email.</span>

                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="8+ characters"
                    minLength={8}
                    maxLength={15}
                    required
                    className="w-full px-3 py-2 my-1  rounded-md input-field"
                  />
                  <span onClick={togglePasswordRegister} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                    </svg>
                  </span>
                  <span className="invalid-feedback">Please enter a valid password.</span>

                </div>
                <button type="submit" disabled={logging} className="w-full py-2 button-success ">
                  Sign Up
                </button>
                <div className="py-2 text-center">OR</div>
                <div className='d-flex mb-2'>
                  <button onClick={signByGoogle}
                    className="w-full flex items-center justify-center py-2 gap-2 button-google ">
                    <Image src="/images/svg/google-logo.svg" alt="" width={30} height={30} />Sign in Google
                  </button>
                </div>
              </form>
            )}

            {/* Forgot Password */}
            {forgetPWD && (
              <form onSubmit={forgotPassword} className="space-y-4" >
                <p className="text-center text-sm">
                  Enter your email, and we'll send you a reset link.
                </p>
                <input
                  type="email"
                  name="email"
                  placeholder="email@address.com"
                  required
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                />
                <button type="submit" disabled={logging} className="w-full py-2 my-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal