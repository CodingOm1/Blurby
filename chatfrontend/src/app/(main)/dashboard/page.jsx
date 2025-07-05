'use client'
import React, { useEffect, useState } from 'react'
import ActionBar from '@/components/ActionBar'
import Sidebar from '@/components/Sidebar'
import Window from '@/components/Window'
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { connectSocket } from '@/lib/socket'
import { getSocket } from '@/lib/socket';
import NewChat from '@/components/NewChat'



export default function Page() {

  const [selectedChat, setSelectedChat] = useState('')
  const [userId, setUserId] = useState('')
  const router = useRouter()
  const [finderOpen, setFinderOpen] = useState(false)
  const [chatList, setChatList] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('blurbyToken');
    if (!token) return;

    axios.get('/api/user/getId', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        console.log(res.data.userId)
        setUserId(res.data.userId)
      })
      .catch(err => {
        console.log(err)
        router.push('/')
      });
  }, []);

  useEffect(() => {
    if (userId) {
      connectSocket(userId)
    }
  }, [userId]);


  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      connectSocket(userId);
      return;
    }
    const handleDataList = (response) => {
      console.log(response)
      setChatList(response.chats)
    }

    socket.emit("fetch-all-chats", { userId }); // send as object
    socket.on("fetch-all-chats", handleDataList);


    return () => {
      socket.off("fetch-all-chats", handleDataList);
    };
  }, [userId]);




  return (
    <div className={`w-full max-h-screen h-screen bg-[#eee3ff] md:p-5 overflow-hidden 
    flex  items-center justify-center gap-2`}>
      {finderOpen === true && <NewChat userId={userId} setFinderOpen={setFinderOpen} setSelectedChat={setSelectedChat} />}

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
              <Sidebar setFinderOpen={setFinderOpen} chatList={chatList} setSelectedChat={setSelectedChat} />
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
              <Window userId={userId} message={message} messages={messages} setMessage={setMessage} selectedChat={selectedChat} setMessages={setMessages} setSelectedChat={setSelectedChat} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='w-full h-full hidden md:flex items-center justify-center gap-5 p-2'>
        <ActionBar />
        <Sidebar setFinderOpen={setFinderOpen} setSelectedChat={setSelectedChat} chatList={chatList} />
        <Window userId={userId}  message={message} setMessage={setMessage} setMessages={setMessages} messages={messages} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      </div>
    </div>
  )
}
