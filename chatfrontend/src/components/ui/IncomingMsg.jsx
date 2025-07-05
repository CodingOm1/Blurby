import React from 'react'

export default function IncomingMsg({msg, time}) {
  return (
    <div className='flex mb-6 group'>
                  <div className='max-w-[75%] px-4 py-3 bg-gray-50 rounded-3xl rounded-tl-none shadow-sm border border-gray-100 relative'>
                    <div className='absolute -left-1.5 top-0 w-3 h-3 overflow-hidden'>
                      <div className='w-full h-full bg-gray-50 border-l border-t border-gray-100 transform rotate-45 origin-bottom-right'></div>
                    </div>
                    <p className='text-gray-800 font-medium'>{msg}</p>
                    <p className='text-xs text-gray-400 mt-1 flex items-center gap-1'>
                      {time}
                      <span className='text-gray-300 group-hover:opacity-100 opacity-0 transition-opacity'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </p>
                  </div>
                </div>
  )
}
