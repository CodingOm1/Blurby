'use client'
import React from 'react'
import MessageBar from './MessageBar'


export default function Window({ selectedChat }) {
  return (
    <div className='window w-[70%] h-full flex flex-col items-center justify-center gap-2'>
      {/* Chat container with subtle texture */}
      <div className={`w-full h-[90%] ${!selectedChat ? 'bg-[#f6f6f6]' : 'bg-[#fff]'} rounded-t-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] relative`}>
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


                <div className='flex justify-center mb-6'>
                  <div className='px-3 py-1 bg-gray-100 rounded-full shadow-inner'>
                    <span className='text-xs font-medium text-gray-500'>TODAY</span>
                  </div>
                </div>

                <div className='flex mb-6 group'>
                  <div className='max-w-[75%] px-4 py-3 bg-gray-50 rounded-3xl rounded-tl-none shadow-sm border border-gray-100 relative'>
                    <div className='absolute -left-1.5 top-0 w-3 h-3 overflow-hidden'>
                      <div className='w-full h-full bg-gray-50 border-l border-t border-gray-100 transform rotate-45 origin-bottom-right'></div>
                    </div>
                    <p className='text-gray-800 font-medium'>Hey! Just finished the designs for our project</p>
                    <p className='text-xs text-gray-400 mt-1 flex items-center gap-1'>
                      10:30 AM
                      <span className='text-gray-300 group-hover:opacity-100 opacity-0 transition-opacity'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </p>
                  </div>
                </div>

                <div className='flex mb-6 justify-end group'>
                  <div className='max-w-[75%] px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-3xl rounded-tr-none shadow-lg relative'>
                    <div className='absolute -right-1.5 top-0 w-3 h-3 overflow-hidden'>
                      <div className='w-full h-full bg-indigo-500 transform rotate-45 origin-bottom-left'></div>
                    </div>
                    <p className='font-medium'>That's awesome! The color scheme looks perfect</p>
                    <p className='text-xs text-purple-100 mt-1 flex items-center gap-1 justify-end'>
                      10:32 AM
                      <span className='text-purple-200 group-hover:opacity-100 opacity-0 transition-opacity'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </p>
                  </div>
                </div>

                <div className='flex mb-2 justify-end group'>
                  <div className='max-w-[75%] px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-3xl rounded-tr-none shadow-lg relative'>
                    <div className='absolute -right-1.5 top-0 w-3 h-3 overflow-hidden'>
                      <div className='w-full h-full bg-indigo-500 transform rotate-45 origin-bottom-left'></div>
                    </div>
                    <p className='font-medium'>When can we schedule the next review?</p>
                    <p className='text-xs text-purple-100 mt-1 flex items-center gap-1 justify-end'>
                      10:33 AM
                      <span className='text-purple-200 opacity-100'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </p>
                  </div>
                </div>
                <div className='flex justify-end mb-6'>
                  <div className='flex items-center gap-1'>
                    <span className='text-xs text-gray-400 font-medium'>Read</span>
                    <div className='flex -space-x-1'>
                      <img className='w-4 h-4 rounded-full border border-white' src="/blurby.png" alt="Read by" />
                    </div>
                  </div>
                </div>

                <div className='flex mb-6'>
                  <div className='max-w-[75%] px-4 py-3 bg-gray-50 rounded-3xl rounded-tl-none shadow-sm border border-gray-100 relative'>
                    <div className='absolute -left-1.5 top-0 w-3 h-3 overflow-hidden'>
                      <div className='w-full h-full bg-gray-50 border-l border-t border-gray-100 transform rotate-45 origin-bottom-right'></div>
                    </div>
                    <div className='flex space-x-1 items-end'>
                      <div className='typing-indicator'>
                        <div className='dot'></div>
                        <div className='dot'></div>
                        <div className='dot'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div></>
        }


      </div>

      {/* Message bar */}
      <MessageBar />


    </div>
  )
}