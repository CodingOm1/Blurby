import React from 'react'

export default function TypingIndicator() {
  return (
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
  )
}
