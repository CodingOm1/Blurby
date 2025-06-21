'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPaperclip, FiMic, FiSend } from 'react-icons/fi'
import { BsEmojiSmile } from 'react-icons/bs'

export default function MessageBar({ message, setMessage, onSend }) {
  const [isRecording, setIsRecording] = useState(false)


  return (
    <div className="w-full px-4 pb-4">
      <motion.div
        className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        whileHover={{
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Attachment button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 text-gray-500 hover:text-purple-600 rounded-lg"
        >
          <FiPaperclip size={20} />
        </motion.button>

        {/* Input field */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 py-3 px-4 bg-gray-50 rounded-lg outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-100 transition-all"
        />

        {/* Emoji button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 text-gray-500 hover:text-yellow-500 rounded-lg"
        >
          <BsEmojiSmile size={20} />
        </motion.button>

        {/* Send/Record button */}
        <motion.button

          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-xl ${message
              ? 'bg-purple-600 text-white'
              : isRecording
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          onClick={() => {
            if (message) {
              onSend();
              setMessage('');
            } else {
              setIsRecording(!isRecording);
            }
          }}
          animate={{
            scale: isRecording ? [1, 1.05, 1] : 1
          }}
          transition={{
            duration: 1.5,
            repeat: isRecording ? Infinity : 0
          }}
        >
          {message ? <FiSend size={18} /> : <FiMic size={18} />}
        </motion.button>
      </motion.div>
    </div>
  )
}