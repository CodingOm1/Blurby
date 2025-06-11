'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'



export default function Page() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem("blurbyToken");
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);
  const handleSubmit = async (e) => {

    e.preventDefault()




    const formData = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post('/api/user/login',
        formData
      )
      console.log(response.data)
      localStorage.setItem("blurbyToken", response.data.token)
      if (response.status === 200 || response.status === 201) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.log("Error", error)
    }

  }





  return (
    <div className='w-full select-none h-screen flex items-center justify-center bg-[#9696a5] p-4'>
      <div className="signup w-full md:w-[90%] lg:w-[80%] xl:w-[70%] h-full md:h-[90%] bg-[#231d33] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-center gap-5 mod_shadow">

        {/* LEFT IMAGE SECTION */}
        <div className="left w-full md:w-[50%] hidden md:block h-[250px] md:h-full rounded-2xl overflow-hidden">
          <img
            src="https://i.pinimg.com/736x/10/5e/e5/105ee51b4aed1ab19b4c593761ec6069.jpg"
            alt=""
            className="w-full h-full object-cover scale-[1.2]"
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="right w-full md:w-[50%] h-[95%] md:h-full pl-2 md:pl-10 -mt-10">
          <form onSubmit={handleSubmit} className='flex flex-col items-start gap-5 w-full h-full justify-center'>
            <div className="flex items-center justify-center w-full gap-5 mb-10">
              <img src="/blurby.png" width={50} alt="" />
              <h2 className='text-3xl md:text-3xl text-white font-inter  md:-pt-5'>Login your account</h2>

            </div>


            <input className='md_input w-full' type="email" placeholder='Email' required value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <input className='md_input w-full' type="password" placeholder='Password' required value={password} onChange={(e) => { setPassword(e.target.value) }} />


            <button className='w-full mt-5 cursor-pointer md:mt-5 py-3 bg-purple-700 rounded-md text-white font-inter hover:bg-purple-600 transition-all'>
              Login
            </button>
            <p className='px-2 py-4 text-gray-500 font-poppins text-[14px] md:-mt-5'>
              Don't have an account?
              <Link href={'/auth/signup'}>
                <span className='text-purple-600 font-semibold cursor-pointer hover:underline'> Sign Up</span>
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>

  )
}
