'use client'

import { useEffect, useState } from 'react'


export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [inputValue, setInputValue] = useState('Single')

  useEffect(()=>{
    const getAllData = async()=>{
    try {
        let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
        const res = await fetch(`${domain}/quiz/get-all-quiz`, {
          method: 'Get',
         
        });
  
        const data = await res.json();
  
      console.log(data)
       
  
      } catch (error) {
        console.error(error)
      }
    }
    getAllData()
  },[])
  return (
    <section className='mx-5 container'>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Questions</h1>
      </div>


    </section>


  )
}
