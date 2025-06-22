'use client'
import React, { useState, useEffect, useRef } from 'react'
import { getSocket } from '@/lib/socket'
import { format, isToday, isYesterday } from 'date-fns'
import MessageBar from './MessageBar'
import SystemMSG from './ui/SystemMSG'
import MessageBoxTo from './ui/MessageBoxTo'
import MessageBoxMe from './ui/MessageBoxMe'
import TypingIndicator from './TypingIndicator'
import { motion, AnimatePresence } from 'framer-motion'

export default function Window({ selectedChat, userId }) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)
  const socket = getSocket()

  // Unified message handling
  useEffect(() => {
    if (!selectedChat?.chatId) return

    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        socket.emit('get-messages', {
          chatId: selectedChat.chatId,
          limit: 50,
          skip: 0
        })
      } catch (error) {
        console.error('Error fetching messages:', error)
        setIsLoading(false)
      }
    }

    setInterval(() => {
      fetchMessages()
    }, 50);


    const handleMessagesList = (response) => {
      if (response.status === 'success') {
        setMessages(response.messages)
        scrollToBottom()
      }
      setIsLoading(false)
    }

    const handleNewMessage = (data) => {
      if (data.chatId !== selectedChat.chatId) return

      setMessages(prev => {
        // Replace temp message if exists
        if (data.tempId) {
          return prev.map(msg =>
            msg.tempId === data.tempId ? { ...data.message, status: 'sent' } : msg
          )
        }
        // Add new message if not exists
        if (!prev.some(msg => msg._id === data.message._id)) {
          return [...prev, data.message]
        }
        return prev
      })
      scrollToBottom()
    }

    const handleTyping = ({ chatId, userId: typingUserId, isTyping }) => {
      if (chatId === selectedChat.chatId && typingUserId !== userId) {
        setTypingUsers(prev =>
          isTyping
            ? [...new Set([...prev, typingUserId])]
            : prev.filter(id => id !== typingUserId)
        );
      }
    };
    socket.on('messages-list', handleMessagesList)
    socket.on('new-message', handleNewMessage)
    socket.on('typing', handleTyping)

    return () => {
      socket.off('messages-list', handleMessagesList)
      socket.off('new-message', handleNewMessage)
      socket.off('typing', handleTyping)
    }
  }, [selectedChat?.chatId, userId])

  // Typing indicator with debounce
  useEffect(() => {
    if (!selectedChat?.chatId || !message) return

    const typingTimeout = setTimeout(() => {
      socket.emit('typing', {
        chatId: selectedChat.chatId,
        isTyping: message.length > 0
      })
    }, 500)

    return () => clearTimeout(typingTimeout)
  }, [message, selectedChat?.chatId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat?.chatId) return

    const tempId = `temp-${Date.now()}`
    const tempMessage = {
      tempId,
      message: message.trim(),
      sender: { _id: userId },
      createdAt: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, tempMessage])
    setMessage('')
    
    socket.emit('send-message', {
      chatId: selectedChat.chatId,
      message: message.trim(),
      chatModel: 'DirectChat',
      senderId: userId,
      tempId
    })
    scrollToBottom()
  }

  const formatMessageDate = (date) => {
    if (isToday(date)) return 'TODAY'
    if (isYesterday(date)) return 'YESTERDAY'
    return format(date, 'MMMM d, yyyy')
  }

  const renderMessages = () => {
    if (isLoading && messages.length === 0) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      )
    }

    if (!messages.length && !isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-full text-gray-500"
        >
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </motion.div>
      )
    }

    const groupedMessages = messages.reduce((groups, message) => {
      const date = formatMessageDate(new Date(message.createdAt))
      if (!groups[date]) groups[date] = []
      groups[date].push(message)
      return groups
    }, {})

    return Object.entries(groupedMessages).map(([date, dayMessages]) => (
      <React.Fragment key={date}>
        <SystemMSG msg={date} />
        <AnimatePresence>
          {dayMessages.map(msg => {
            const key = msg.tempId || msg._id
            return msg.sender._id === userId ? (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageBoxMe
                  msg={msg.message}
                  time={format(new Date(msg.createdAt), 'h:mm a')}
                  status={msg.status}
                />
              </motion.div>
            ) : (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageBoxTo
                  msg={msg.message}
                  time={format(new Date(msg.createdAt), 'h:mm a')}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </React.Fragment>
    ))
  }

  return (
    <div className='window w-full md:w-[70%] h-full flex flex-col items-center justify-center gap-2'>
      <div className={`w-full h-[90%] ${!selectedChat ? 'bg-[#f6f6f6]' : 'bg-[#fdeaff]'} rounded-t-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] relative`}>
        {!selectedChat ? (
          <div className='w-full h-full flex items-center justify-center'>
            <img src="/logo.png" width={300} alt="" className="max-w-[80%] md:max-w-none" />
          </div>
        ) : (
          <>
            <div className='w-full px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 backdrop-blur-lg bg-gradient-to-r from-white/95 to-white/90 border-b border-white/30'>
              <div className='relative'>
                <div className='w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white overflow-hidden shadow-lg'>
                  <img
                    src={selectedChat.profileImg || '/normaldm.jpg'}
                    alt={selectedChat.firstName}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white animate-pulse'></div>
              </div>

              <div className='flex-1 min-w-0'>
                <h2 className='text-base md:text-lg font-semibold text-gray-900 tracking-tight truncate'>
                  {selectedChat.firstName} {selectedChat.lastName}
                </h2>
                {selectedChat.isOnline && (
                  <p className='text-xs font-medium text-green-600 tracking-wide'>Online</p>
                )}
              </div>

              <div className='flex items-center gap-2 md:gap-3'>
                <button className='p-1 md:p-2 text-gray-500 hover:text-gray-700 transition-colors'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
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

            <div className='w-full h-[calc(100%-80px)] p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50/30'>
              {renderMessages()}
              {typingUsers.length > 0 && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      {selectedChat && (
        <MessageBar
          message={message}
          setMessage={setMessage}
          onSend={handleSendMessage}
        />
      )}
    </div>
  )
}