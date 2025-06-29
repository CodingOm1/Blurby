'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import SmallLoading from '@/components/ui/SmallLoading'
import AlertBubble from '@/components/ui/Bubbles'
import { useRouter } from 'next/navigation'

export default function Page() {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (phone.length != 10) {
      return 0;
    }

    if (password != confirmPassword) {
      return 0;
    }

    setLoading(true)
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      password: password
    }

    try {
      const response = await axios.post('/api/user/register',
        formData
      )
      console.log(response.data)
      localStorage.setItem("blurbyToken", response.data.token)
      setLoading(false)
      AlertBubble(response.data.message, 'good')
      router.push('/dashboard')
    } catch (error) {
      console.log("Error", error)
      setLoading(false)
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
          <h2 className='text-3xl md:text-3xl text-white font-inter  md:pt-5'>Create an account</h2>

          <form onSubmit={handleSubmit} className='flex flex-col items-start gap-5 w-full'>
            <div className='w-full flex flex-col md:flex-row gap-4 mt-6'>
              <input className='md_input w-full' type="text" placeholder='First Name' value={firstName} onChange={(e) => { setFirstName(e.target.value) }} required />
              <input className='md_input w-full' type="text" placeholder='Last Name' value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
            </div>

            <input
              className='md_input w-full'
              type="text"
              placeholder='Phone No.'
              required
              value={phone}
              onChange={(e) => { setPhone(e.target.value) }}
              minLength={10}
              maxLength={10}
            />

            <input className='md_input w-full' type="email" placeholder='Email' required value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <input className='md_input w-full' type="password" placeholder='Password' required value={password} onChange={(e) => { setPassword(e.target.value) }} />
            <input className='md_input w-full' type="password" placeholder='Confirm Password' required value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />

            <div className="flex items-center md:-mt-3 gap-3 text-sm text-gray-300 px-2 py-2">
              <input type="checkbox" className="accent-purple-600 w-4 h-4" required />
              <label className="select-none">I agree to the <span className="text-purple-600 font-semibold cursor-pointer hover:underline">Terms & Conditions</span></label>
            </div>

            {loading === true ?
              <button disabled className='w-full -mt-5 cursor-not-allowed md:-mt-5 py-3 bg-purple-900 rounded-md text-gray-300 font-inter  transition-all flex items-center justify-center gap-5'>
                <span>
                  Create account
                </span>
                <span className='mt-2 '>
                  <SmallLoading />
                </span>
              </button>
              :
              <button className='w-full -mt-5 cursor-pointer md:-mt-5 py-3 bg-purple-700 rounded-md text-white font-inter hover:bg-purple-600 transition-all'>
                <span>
                  Create account
                </span>

              </button>}
          </form>

          <p className='px-2 py-4 text-gray-500 font-poppins text-[14px]'>
            Already have an account?
            <Link href={'/auth/login'}>
              <span className='text-purple-600 font-semibold cursor-pointer hover:underline'> Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>

  )
}
