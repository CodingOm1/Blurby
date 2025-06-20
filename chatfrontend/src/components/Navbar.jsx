'use client'
import React, { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import Link from 'next/link'
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='w-full px-6 md:px-20 lg:px-40 py-5 fixed top-0 left-0 z-50 bg-[#ffffffa8] backdrop-blur-md shadow-2xl shadow-[#0000001a] rounded-b-3xl'>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="logo flex items-center gap-2">
          <img src="/blurby.png" width={40} alt="Blurby Logo" />
          <h2 className='font-sora text-[#192144] text-2xl font-bold'>Blurby</h2>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-10 font-inter list-none">
          <li className='text-md text-black cursor-pointer'>Home</li>
          <li className='text-md text-black cursor-pointer'>About</li>
          <li className='text-md text-black cursor-pointer'>Pricing</li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden z-50">
          {isOpen ? (
            <HiX onClick={() => setIsOpen(false)} className="w-7 h-7 cursor-pointer" />
          ) : (
            <HiMenu onClick={() => setIsOpen(true)} className="w-7 h-7 cursor-pointer" />
          )}
        </div>

        {/* Desktop Button */}
        <Link href={'/auth/login'}>
        <button className='hidden md:block py-2 px-8 bg-[#192144] text-white font-inter rounded-sm hover:bg-[#192144e1] transition-all'>
          Login
        </button></Link>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col items-start gap-4 animate-slideDown z-40 bg-white rounded-lg p-4 shadow-lg">
          <li className='text-md text-black cursor-pointer'>Home</li>
          <li className='text-md text-black cursor-pointer'>About</li>
          <li className='text-md text-black cursor-pointer'>Pricing</li>
          <Link href={'/auth/login'}>
          <button className='py-2 px-6 bg-[#192144] text-white rounded-sm hover:bg-[#192144e1] transition-all w-full text-left'>
            Login
          </button></Link>
        </div>
      )}
    </div>
  )
}
