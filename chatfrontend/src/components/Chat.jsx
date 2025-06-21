'use client'

import React from 'react'

export default function Chat({ name, lastTime, lastMessage, isOnline, unread, setSelectedChat, mainInfo }) {
    return (
        <div onClick={() => { setSelectedChat(mainInfo) }} className='w-full px-4 py-3 hover:bg-zinc-200 transition-all cursor-pointer flex items-center justify-between select-none '>
            <div className='flex items-center gap-3 w-full h-full overflow-hidden'>
                {/* Profile Image */}
                <div className='w-12 h-12 border border-zinc-300 relative rounded-full shrink-0'>
                    <div className='w-full h-full rounded-full overflow-hidden'>
                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/profile-3d-icon-download-in-png-blend-fbx-gltf-file-formats--user-about-me-member-interface-pack-icons-4996977.png" className='w-full h-full object-cover ' alt="" />

                    </div>
                    {isOnline && <div className='online w-3 h-3 bg-green-600 border-2 border-[#F6F6F6] rounded-full absolute bottom-0 right-1 translate-x-1 z-9'></div>}
                </div>

                {/* Chat Details */}
                <div className='flex-1 flex flex-col justify-center overflow-hidden'>
                    <div className='flex items-center justify-between w-full'>
                        <h2 className='text-[15px] font-semibold text-gray-900 truncate pr-2'>{name}</h2>
                        <span className='text-[11px] text-gray-500 shrink-0'>{lastTime}</span>
                    </div>
                    <div className="flex items-center justify-between w-full ">
                        <p className='text-[13px] text-gray-600 truncate pr-2'>{lastMessage}</p>
                        {unread ? <div className='w-4 h-4 rounded-full bg-purple-800 text-white flex items-center justify-center '>
                            <span className='text-[10px] mr-0.5'>{unread}</span>
                        </div> : ''}
                    </div>
                </div>
            </div>
        </div>
    )
}
