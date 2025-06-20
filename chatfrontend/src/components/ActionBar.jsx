import React from 'react'
import { TbMessageCircle } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineNotification } from "react-icons/ai";
import { LuUser } from "react-icons/lu";



export default function ActionBar() {
    return (
        <div className='actionsidebar w-20 h-full  bg-[#02001A] rounded-2xl flex flex-col items-center justify-between py-5'>
            <img src="/blurby.png" width={30} alt="logo" className='' />
            <div className='flex flex-col list-none items-center justify-center gap-10 '>
                <TbMessageCircle className='text-2xl text-white  cursor-pointer hover:text-purple-500 transition-all ' />
                <IoNotificationsOutline className='text-2xl text-white  cursor-pointer hover:text-purple-500 transition-all ' />
                <AiOutlineNotification className='text-2xl text-white  cursor-pointer hover:text-purple-500 transition-all ' />
            </div>

            <div className='w-10 h-10 bg-zinc-700 transition-all hover:bg-zinc-600 cursor-pointer rounded-full flex items-center justify-center'>
            <LuUser className='text-xl text-white ' />
            </div>
        </div>
    )
}
