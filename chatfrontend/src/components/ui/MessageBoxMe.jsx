import React from 'react'

export default function MessageBoxMe({msg, time}) {
  return (
     <div className='flex mb-6 justify-end group'>
                  <div className='max-w-[75%] px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-3xl rounded-tr-none shadow-lg relative'>
                    <div className='absolute -right-1.5 top-0 w-3 h-3 overflow-hidden'>
                      <div className='w-full h-full bg-indigo-500 transform rotate-45 origin-bottom-left'></div>
                    </div>
                    <p className='font-medium'>{msg}</p>
                    <p className='text-xs text-purple-100 mt-1 flex items-center gap-1 justify-end'>
                      {time}
                      <span className='text-purple-200 group-hover:opacity-100 opacity-0 transition-opacity'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </p>
                  </div>
                </div>
  )
}
