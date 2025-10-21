
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext';
import { useAuthFetch } from '@/app/utils/authFetch';

const UsersPage = () => {

    const fetchWithAuth = useAuthFetch();

    const { user } = useAuth();
    const [UserName, setUserName] = useState('');
    const [email, setEmail] = useState('');


    useEffect(() => {
        if (user?.name) {
            setUserName(user.name);
        }
        if (user?.email) setEmail(user?.email)
    }, [user]);

    const handleChangeUserName = (e: any) => {
        if (e.target.value.match("^[a-zA-Z ]*$") != null) {
            setUserName(e.target.value);
        }
    }

    useEffect(() => {
    }, [UserName])


    const update = async () => {

        let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
        const res = await fetchWithAuth(`${domain}/users/update-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: UserName,
                email: email
            }),
        });


        if (res.status == 201) {
            alert('Details updated successfully!')
            location.reload();
        }
        else {
            alert('An error occured. Please try again!')
        }



    }

    const updatePassword = async (e: any) => {
        e.preventDefault()
        const curr_password = e.target.curr_password.value.trim();
        const new_password = e.target.new_password.value.trim();
        console.log(curr_password, new_password)
        const new_password_confirm = e.target.new_password_confirm.value.trim();
        if (!curr_password || !new_password || !new_password_confirm) {
            return alert('Please fill in all fields.');
        }

        if (new_password !== new_password_confirm) {
            return alert('New password and confirmation do not match.');
        }

        let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
        const res = await fetchWithAuth(`${domain}/users/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                curr_password: curr_password,
                new_password: new_password

            }),
        });
        const data = await res.json();
        if (res.status != 201)
            return alert(data.message)
        res.status == 201 ? location.reload() : alert('An error occured. Please try again!')
    }
    return (
        <>


            <section className='about-us clearfix mt-5'>
                <div className='container hero-bnr py-4'>
                    <div className='row text-center'>
                        <div className='col-10 mx-auto'>
                            <div className="section-header">
                                <h1 className='h2'>Profile</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='container p-0'>
                <div className="row">
                    <div className="col-md-6">
                        <h3>Account Details</h3>
                        <form onSubmit={update} method="POST" name="submit-form">
                            <div className="mb-3">
                                <label className="form-label fs-base">Email</label>
                                <div className="form-control shadow-xn text-muted form-control-lg rounded-0 border">{user?.email}</div>
                            </div>
                            <div className="mb-3" >
                                <label className="form-label fs-base">Full Name</label>
                                <input name="name" className="form-control shadow-xn text-muted form-control-lg rounded-0 border" type="text" placeholder="Full Name" maxLength={30} value={UserName || ''} required onChange={handleChangeUserName} />

                            </div>

                            <input name="id" className="form-control shadow-xn text-muted form-control-lg rounded-0 border" type="hidden" value={user?.id || ''} />
                            <button type="submit" className='btn button-primary'>Update</button>
                        </form>
                    </div>

                    <div className='col-md-6'>
                        <h3>Update Password</h3>
                        <form onSubmit={updatePassword} method="POST" name="pwd-form">
                            <div className="mb-3">
                                <label className="form-label fs-base">Current Password</label>
                                <input name="curr_password" className="form-control shadow-xn text-muted form-control-lg rounded-0 border" type="password" placeholder="Current Password" defaultValue='' minLength={8} maxLength={12} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fs-base">New Password</label>
                                <input name="new_password" className="form-control shadow-xn text-muted form-control-lg rounded-0 border" type="password" placeholder="New Password" defaultValue='' minLength={8} maxLength={12} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fs-base">New Password Confirmation</label>
                                <input name="new_password_confirm" className="form-control shadow-xn text-muted form-control-lg rounded-0 border" type="password" placeholder="New Password Confirmation" defaultValue='' minLength={8} maxLength={12} required />
                                <input name="id" className="form-control shadow-xn text-muted form-control-lg rounded-0 border" type="hidden" value={user?.id || ''} />
                            </div>
                            <button type="submit" className='button-primary'>Update Password</button>
                        </form>
                    </div>
                </div>
            </section>

            
        </>
    )
}



export default UsersPage;