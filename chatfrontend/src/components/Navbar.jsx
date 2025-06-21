'use client'
import React, { useState, useEffect } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-12 py-3 fixed top-0 left-0 z-50 
      bg-[#ffffffcc] backdrop-blur-[20px] shadow-sm transition-all duration-300
      ${scrolled ? 'shadow-[#00000010]' : 'shadow-transparent'}`}>
      
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="logo flex items-center gap-2 z-50">
          <img src="/blurby.png" width={36} height={36} alt="Blurby Logo" 
               className="w-9 h-9 object-contain" />
          <h2 className='font-sora text-[#192144] text-xl sm:text-2xl font-bold'>Blurby</h2>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-inter list-none">
          <li className='group relative'>
            <Link href="/" className='text-sm lg:text-base text-[#192144] hover:text-[#192144cc] transition-colors'>
              Home
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#192144] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
          <li className='group relative'>
            <Link href="/about" className='text-sm lg:text-base text-[#192144] hover:text-[#192144cc] transition-colors'>
              About
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#192144] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
          <li className='group relative'>
            <Link href="/pricing" className='text-sm lg:text-base text-[#192144] hover:text-[#192144cc] transition-colors'>
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#192144] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
        </ul>

        {/* Desktop Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login">
            <button className='py-2 px-6 bg-[#192144] text-white font-medium rounded-full 
              hover:bg-[#192144e1] transition-all text-sm lg:text-base
              hover:shadow-[0_4px_12px_rgba(25,33,68,0.15)]'>
              Login
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden z-50">
          {isOpen ? (
            <HiX onClick={() => setIsOpen(false)} className="w-6 h-6 cursor-pointer text-[#192144]" />
          ) : (
            <HiMenu onClick={() => setIsOpen(true)} className="w-6 h-6 cursor-pointer text-[#192144]" />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-[#ffffffcc] backdrop-blur-[20px] z-40 
        transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ paddingTop: '5rem' }}>
        
        <div className="container mx-auto px-6 py-4 flex flex-col items-center gap-8">
          <ul className="w-full flex flex-col items-center gap-6 font-inter">
            <li className='w-full text-center border-b border-[#00000010] pb-4'>
              <Link href="/" className='text-lg text-[#192144] font-medium' onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li className='w-full text-center border-b border-[#00000010] pb-4'>
              <Link href="/about" className='text-lg text-[#192144] font-medium' onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li className='w-full text-center border-b border-[#00000010] pb-4'>
              <Link href="/pricing" className='text-lg text-[#192144] font-medium' onClick={() => setIsOpen(false)}>
                Pricing
              </Link>
            </li>
          </ul>
          
          <Link href="/auth/login" className='w-full max-w-xs'>
            <button className='w-full py-3 px-6 bg-[#192144] text-white font-medium rounded-full 
              hover:bg-[#192144e1] transition-all text-base mt-4'
              onClick={() => setIsOpen(false)}>
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}