import React from 'react'
import { CiSearch } from "react-icons/ci";

export default function NewChat() {
  return (
    <div className='w-full h-screen fixed top-0 left-0 backdrop-blur-[2px] bg-[#00000023] z-20'>
        <div className='w-full h-screen flex items-center justify-center relative'>
                <div className='w-[500px] max-h-[400px] py-5 bg-white rounded-xl p-5 flex flex-col items-center justify-center gap-5 shadow-md'>
                        <div className='flex items-center w-full gap-2'>
                            <CiSearch className='text-2xl' />
                            <input type="text" placeholder='Search Phone Number' className='w-full px-5 py-2 outline-none border border-gray-300 rounded-3xl focus:border-purple-500' />
                        </div>
                        <div className='flex flex-col gap-2 w-full  max-h-full overflow-x-hidden px-5 py-2'>
                            {/* <h2 className='text-gray-500'>Not Found</h2> */}
                            <div className='flex items-center  justify-start gap-2 hover:bg-zinc-200 w-full px-5 rounded-xl select-none cursor-pointer py-[5px]'>
                                <div className='w-12 h-12 border  rounded-full border-zinc-500 overflow-hidden'>
                                  <img src="/normaldm.jpg" className='rounded-full object-cover w-full h-full scale-[1.2]' alt="" />
                                
                                </div>
                                <div className='flex flex-col justify-between py-2'>
                                  <h2 className='font-inter text-[15px]'>Om Waghmare</h2>
                                  <p className='text-[12px] text-gray-600 '>Always in Heart ~</p>
                                </div>
                            </div>
                            
                        </div>

                </div>
        </div>
    </div>
  )
}
