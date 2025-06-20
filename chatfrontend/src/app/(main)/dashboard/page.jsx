'use client'

import ActionBar from '@/components/ActionBar'
import Sidebar from '@/components/Sidebar'
import Window from '@/components/Window'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connectSocket, getSocket } from '@/lib/socket.js'
import NewChat from '@/components/NewChat'

export default function Page() {
  const [userId, setUserId] = useState('')
  const [chatList, setChatList] = useState([])
  const [finderOpen, setFinderOpen] = useState(false)



  // ✅ Step 1: Token Checker
  const CheckToken = async () => {
    const BlurbyToken = localStorage.getItem('blurbyToken')
    if (BlurbyToken) {
      try {
        const fetchResponse = await axios.get('/api/user/get', {
          headers: { Authorization: `Bearer ${BlurbyToken}` },
        })

        if (fetchResponse.status === 200) {
          setUserId(fetchResponse.data.User._id)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  // ✅ Step 2: Run Token Checker on Mount
  useEffect(() => {
    const fetchUser = async () => {
      await CheckToken()
    }
    fetchUser()
  }, [])

  // ✅ Step 3: Connect Socket when userId is ready
  useEffect(() => {
    if (!userId) return

    connectSocket(userId)
    const socket = getSocket()

    socket.on('chat-list', (data) => {
      const { chats, users } = data

      const formattedChats = chats.map((chat) => {
        const opponentId = chat.members.find((id) => id !== userId)
        const opponent = users.find((user) => user._id === opponentId)

        return {
          chatId: chat._id,
          name: opponent?.firstName || 'Unknown',
          userId: opponent?._id,
          lastMessage: chat.lastMessage || '',
          lastTime: chat.lastTime || '',
          isOnline: chat.isOnline || false,
          unread: chat.unread || 0,
        }
      })

      setChatList(formattedChats)
    })

    socket.on('chat-list-error', (err) => {
      console.error('Chat List Error:', err)
    })

    
    return () => {
      socket.off('chat-list')
      socket.off('chat-list-error')
    }
  }, [userId])

  // ✅ UI
  return (
    <>
      {finderOpen && <NewChat userId={userId} />}
      <div className='w-full h-screen bg-[#EEEEEE] p-5 flex items-center justify-center gap-3'>
        <ActionBar />
        <Sidebar userIs={userId} chats={chatList} setFinderOpen={setFinderOpen} />
        <Window />
      </div>
    </>
  )
}
