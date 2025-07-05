'use client'

import React from 'react'
import { CiSearch } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import Chat from './Chat';


export default function Sidebar({setFinderOpen, setSelectedChat, chatList}) {







    return (
        <div className='sidebar w-full md:bg-transparent bg-[#f6f6f6] md:w-[30%] h-full  flex flex-col items-center justify-center gap-2'>

            <div className='bg-[#F6F6F6] w-full h-20 md:shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-2xl flex items-center justify-between px-6 '>

                {/* Title */}
                <h2 className='text-2xl font-semibold text-black font-inter select-none'>Chats</h2>

                {/* Search Bar */}
                <div className='relative w-[50%] max-w-md h-10 border border-zinc-300 rounded-full flex items-center px-4 bg-white'>
                    <input
                        type="text"
                        placeholder='Search'
                        className='w-full h-full rounded-full  placeholder:text-gray-400 text-sm outline-none text-black font-poppins'
                    />
                    <CiSearch  className='text-xl text-gray-500 cursor-pointer' />
                </div>

                {/* Add Button */}
                <div  className='w-10 h-10 rounded-full bg-purple-700 hover:bg-purple-600 cursor-pointer flex items-center justify-center transition-all'>
                    <IoAdd onClick={() => setFinderOpen(true)} className='text-2xl text-white' />
                </div>
            </div>

            <div className=' bg-[#F6F6F6] w-full h-full shadow-[5px_4px_12px_rgba(0,0,0,0.05)] rounded-l-3xl flex flex-col items-start py-5 overflow-x-hidden overflow-y-scroll relative modern_sc
            ' >
                <div className='w-full px-5 text-[11px] text-gray-400 font-semibold'>CHATS</div>
                {chatList?.map((chat, index) => (
                    <Chat setSelectedChat={setSelectedChat} mainInfo={chat}  key={chat.chatId || index} name={chat.targetUser.firstName} lastMessage={chat.targetUser.lastMessage} lastTime={chat.lastTime} isOnline={chat.isOnline} unread={chat.unread} />
                ))}


                <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    )
}
