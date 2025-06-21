'use client'
import React from 'react'
import MessageBar from './MessageBar'
import SystemMSG from './ui/SystemMSG'
import MessageBoxTo from './ui/MessageBoxTo'
import MessageBoxMe from './ui/MessageBoxMe'
import TypingIndicator from './TypingIndicator'


export default function Window({ selectedChat }) {
  return (
    <div className='window w-[70%] h-full flex flex-col items-center justify-center gap-2'>
      {/* Chat container with subtle texture */}
      <div className={`w-full h-[90%] ${!selectedChat ? 'bg-[#f6f6f6]' : 'bg-[#fdeaff]'} rounded-t-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] relative`}>
        {/* Premium header with status */}
        {
          !selectedChat
            ?
            <div className='w-full h-full flex items-center justify-center'>
              <img src="/logo.png" width={300} alt="" />
            </div>
            :
            <>
              <div className='w-full px-6 py-4 flex items-center gap-4 backdrop-blur-lg bg-gradient-to-r from-white/95 to-white/90 border-b border-white/30'>
                <div className='relative'>
                  <div className='w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg'>
                    <img
                      src={selectedChat.profileImg || '/normaldm.jpg'}
                      alt="Nick Jonas"
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse'></div>
                </div>

                <div className='flex-1'>
                  <h2 className='text-lg font-semibold text-gray-900 tracking-tight'>{selectedChat.firstName}{' '}{selectedChat.lastName}</h2>
                  {selectedChat.isOnline && <p className='text-xs font-medium text-green-600 tracking-wide'>Online</p>}
                </div>

                <div className='flex items-center gap-3'>
                  <button className='p-2 text-gray-500 hover:text-gray-700 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className='p-1 rounded-full hover:bg-gray-100/50 transition-colors'>
                    <div className='flex flex-col gap-1 items-center'>
                      <span className='w-1 h-1 bg-gray-500 rounded-full'></span>
                      <span className='w-1 h-1 bg-gray-500 rounded-full'></span>
                      <span className='w-1 h-1 bg-gray-500 rounded-full'></span>
                    </div>
                  </button>
                </div>
              </div>

              <div className='w-full h-[calc(100%-80px)] p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50/30'>


                <SystemMSG msg={'TODAY'} />

                <MessageBoxTo msg={'Hey Hi How are you'} time={'10:30 AM'} />

                <MessageBoxMe msg={'I am fine bro!, how about you'} time={'10:41 AM'} />
                <MessageBoxMe msg={'When can we schedule the next review?'} time={'10:41 AM'} />


                {/* <div className='flex justify-end mb-6'>
                  <div className='flex items-center gap-1'>
                    <span className='text-xs text-gray-400 font-medium'>Read</span>
                    <div className='flex -space-x-1'>
                      <img className='w-4 h-4 rounded-full border border-white' src="/blurby.png" alt="Read by" />
                    </div>
                  </div>
                </div> */}

                <TypingIndicator />
              </div>
              
              </>
        }


      </div>

      {/* Message bar */}
      <MessageBar />


    </div>
  )
}