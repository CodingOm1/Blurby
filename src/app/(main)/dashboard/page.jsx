import ActionBar from '@/components/ActionBar'
import Sidebar from '@/components/Sidebar'
import Window from '@/components/Window'
import React from 'react'

export default function Page() {
  return (
    <div className='w-full h-screen bg-[#EEEEEE] p-5 flex items-center justify-center gap-3'>
      
      {/* Action Sidebar */}
    <ActionBar />
      
      {/* Chats Sidebar */}
     <Sidebar />
      
      {/* Main Chat Window */}
      <Window />

    </div>
  )
}
