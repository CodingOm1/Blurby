'use client'
import React, { useState, useEffect } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' }
  ]

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className={`w-full px-4 sm:px-6 md:px-8 lg:px-12 py-3 fixed top-0 left-0 z-50 
        bg-[rgba(255,255,255,0.8)] backdrop-blur-[24px] shadow-sm transition-all duration-500
        ${scrolled ? 'shadow-[0_1px_20px_rgba(0,0,0,0.05)]' : 'shadow-transparent'}
        border-b border-[rgba(255,255,255,0.18)]`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo with subtle scale animation */}
        <Link href="/" className="logo flex items-center gap-2 z-50">
          <motion.img 
            src="/blurby.png" 
            width={36} 
            height={36} 
            alt="Blurby Logo"
            className="w-9 h-9 object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          />
          <motion.h2 
            className='font-sora text-[#192144] text-xl sm:text-2xl font-bold'
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            Blurby
          </motion.h2>
        </Link>

        {/* Desktop Nav with liquid hover effect */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-inter list-none">
          {navItems.map((item) => (
            <motion.li 
              key={item.name}
              className='relative'
              onHoverStart={() => setHoveredItem(item.name)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link 
                href={item.path} 
                className='text-sm lg:text-base text-[#192144] relative z-10 px-2 py-1'
              >
                {item.name}
              </Link>
              
              {/* Liquid highlight effect */}
              {hoveredItem === item.name && (
                <motion.div
                  layoutId="navHighlight"
                  className="absolute inset-0 bg-[rgba(25,33,68,0.1)] rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
            </motion.li>
          ))}
        </ul>

        {/* Desktop Button with floating effect */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login">
            <motion.button 
              className='py-2 px-6 bg-[#192144] text-white font-medium rounded-full relative overflow-hidden'
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Login</span>
              {/* Liquid shine effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-transparent opacity-0"
                animate={{ 
                  opacity: [0, 0.3, 0],
                  x: ['-100%', '100%']
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Toggle with spring animation */}
        <motion.div 
          className="md:hidden z-50"
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <HiX 
              onClick={() => setIsOpen(false)} 
              className="w-6 h-6 cursor-pointer text-[#192144]"
            />
          ) : (
            <HiMenu 
              onClick={() => setIsOpen(true)} 
              className="w-6 h-6 cursor-pointer text-[#192144]"
            />
          )}
        </motion.div>
      </div>

      {/* Mobile Menu with smooth sheet animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 bg-[rgba(255,255,255,0.85)] backdrop-blur-[24px] z-40"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            style={{ paddingTop: '5rem' }}
          >
            <div className="container mx-auto px-6 py-4 flex flex-col items-center gap-8">
              <ul className="w-full flex flex-col items-center gap-6 font-inter">
                {navItems.map((item) => (
                  <motion.li 
                    key={item.name}
                    className='w-full text-center border-b border-[rgba(0,0,0,0.05)] pb-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link 
                      href={item.path} 
                      className='text-lg text-[#192144] font-medium'
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              
              <Link href="/auth/login" className='w-full max-w-xs'>
                <motion.button
                  className='w-full py-3 px-6 bg-[#192144] text-white font-medium rounded-full relative overflow-hidden'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="relative z-10">Login</span>
                  {/* Liquid shine effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-transparent opacity-0"
                    animate={{ 
                      opacity: [0, 0.3, 0],
                      x: ['-100%', '100%']
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}