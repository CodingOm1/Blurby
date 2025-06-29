import React from 'react'
import MessageBar from './MessageBar'
import WindowTopBar from './ui/WindowTopBar'

export default function Page() {
  return (
    <div className='w-full md:w-[80%] h-full bg-[#F6F6F6] md:rounded-md relative overflow-hidden  ' >
      <div className='w-full h-[90%] md:h-[85%] overflow-hidden overflow-x-hidden  flex flec-col items-center justify-center'>

    <WindowTopBar />


      </div>
      <MessageBar  />
    </div>
  )
}
