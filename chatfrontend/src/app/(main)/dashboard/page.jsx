'use client'
import React, { useState } from 'react'
import ActionBar from '@/components/ActionBar'
import Sidebar from '@/components/Sidebar'
import Window from '@/components/Window'
import { motion, AnimatePresence } from "framer-motion";


export default function Page() {

  const [selectedChat, setSelectedChat] = useState('hi')


  return (
    <div className={`w-full max-h-screen h-screen bg-[#eee3ff] md:p-5 overflow-hidden 
    flex  items-center justify-center gap-2`}>
      <div className='md:hidden w-full h-full flex flex-col overflow-hidden'>
        <AnimatePresence mode="wait">
          {!selectedChat ? (
            <motion.div
              key="sidebar"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col"
            >
              <Sidebar />
              <ActionBar />
            </motion.div>
          ) : (
            <motion.div
              key="window"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Window />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='w-full h-full hidden md:flex items-center justify-center gap-5 p-2'>
            <ActionBar />
            <Sidebar />
            <Window />
      </div>
    </div>
  )
}
