import React from 'react';
import { FiMoreVertical, FiSearch, FiVideo, FiPhone } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io';

export default function WindowTopBar() {
  return (
    <div className='absolute top-0 left-0 w-full h-16 bg-white px-4 md:px-6 flex items-center justify-between border-b border-gray-100 backdrop-blur-sm bg-opacity-90 z-50'>
      {/* Left side - User info */}
      <div className='flex items-center space-x-3'>
        <div className='relative'>
          <img 
            src="/normaldm.jpg" 
            className='rounded-full w-10 h-10 object-cover ring-2 ring-white shadow-sm' 
            alt="User avatar" 
          />
          <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></span>
        </div>
        <div className='flex flex-col'>
          <h2 className='font-semibold text-gray-800 font-sans text-sm md:text-base'>Nick Jonas</h2>
          <p className='font-normal text-gray-400 text-xs flex items-center'>
            <span className='w-2 h-2 bg-green-400 rounded-full mr-1.5'></span>
            Active now
          </p>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className='flex items-center space-x-4 md:space-x-6'>
        <button className='text-gray-500 hover:text-gray-700 transition-colors'>
          <FiSearch className='w-5 h-5' />
        </button>
        {/* <button className='text-gray-500 hover:text-gray-700 transition-colors'>
          <FiVideo className='w-5 h-5' />
        </button> */}
        <button className='text-gray-500 hover:text-gray-700 transition-colors'>
          <FiPhone className='w-5 h-5' />
        </button>
  
        <button className='text-gray-500 hover:text-gray-700 transition-colors'>
          <FiMoreVertical className='w-5 h-5' />
        </button>
      </div>
    </div>
  )
}