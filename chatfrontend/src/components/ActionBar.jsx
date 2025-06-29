import React from 'react'
import { TbMessageCircle } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineNotification } from "react-icons/ai";
import { LuUser } from "react-icons/lu";

export default function Page() {
    return (
        <div className='w-full h-[50px] md:rounded-sm bg-[#1d1b3a] flex items-center justify-center px-5 md:px-0 text-white md:w-[80px] md:h-full md:flex-col md:justify-between' >
            <div className='w-full h-full md:hidden flex items-center justify-center'>
                <span className='w-full cursor-pointer  h-full  hover:bg-[#f8f8f844] active:bg-[#f8f8f844] flex items-center justify-center'>
                    <TbMessageCircle className='font-bold text-2xl text-white' />
                </span>
                <span className='w-full cursor-pointer h-full  hover:bg-[#f8f8f844] active:bg-[#f8f8f844] flex items-center justify-center'>
                    <IoNotificationsOutline className='font-bold text-2xl text-white' />
                </span>
                <span className='w-full cursor-pointer h-full  hover:bg-[#f8f8f844] active:bg-[#f8f8f844] flex items-center justify-center'>
                    <AiOutlineNotification className='font-bold text-2xl text-white' />
                </span>
                <span className='w-full cursor-pointer h-full  hover:bg-[#f8f8f844] active:bg-[#f8f8f844] flex items-center justify-center'>
                    <LuUser className='font-bold text-2xl text-white' />
                </span>
            </div>
            <div className='hidden  w-full h-full md:flex flex-col items-center justify-between py-5'>
                <div className='w-full  flex items-center justify-center'>
                    <img src="/blurby.png" width={40} height={40} alt="" />
                </div>
                <div className='w-full h-full flex flex-col items-center justify-center'>
                        <span className='w-full h-[80px] flex items-center justify-center'>   
                                <TbMessageCircle className='text-2xl text-white font-bold hover:text-purple-500 hover:text-shadow-2xs shadow-pink-600 transition-all cursor-pointer' />
                        </span>
                        <span className='w-full h-[80px] flex items-center justify-center'>   
                                <IoNotificationsOutline className='text-2xl text-white font-bold hover:text-purple-500 hover:text-shadow-2xs shadow-pink-600 transition-all cursor-pointer' />
                        </span>
                        <span className='w-full h-[80px] flex items-center justify-center'>   
                                <AiOutlineNotification className='text-2xl text-white font-bold hover:text-purple-500 hover:text-shadow-2xs shadow-pink-600 transition-all cursor-pointer' />
                        </span>
                </div>
                <div className='w-full h-[150px] flex items-center justify-center'>
                        <span className='w-[40px] h-[40px] bg-gray-200 rounded-full flex items-center justify-center'>
                            <LuUser className='text-2xl text-black cursor-pointer' />
                            </span>                    
                </div>
            </div>
        </div>
    )
}
