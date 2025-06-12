'use client'

import { motion } from 'framer-motion';

export default function FloatingMessages() {
  const messages = [
    { id: 1, text: "Hey there! 👋", incoming: true, time: "11:45 AM" },
    { id: 2, text: "How's the project going?", incoming: true, time: "11:46 AM" },
    { id: 3, text: "Going great! Just finishing up the animations.", incoming: false, time: "11:48 AM" },
    { id: 4, text: "That's awesome! Can't wait to see it.", incoming: true, time: "11:49 AM" },
  ];

  return (
    <div className="w-full h-[calc(100%-70px)] overflow-y-auto px-6 py-4 space-y-3">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20, x: message.incoming ? -20 : 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`flex ${message.incoming ? "justify-start" : "justify-end"}`}
        >
          <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${message.incoming ? "bg-white rounded-tl-none" : "bg-purple-500 text-white rounded-tr-none"}`}>
            <p>{message.text}</p>
            <p className={`text-xs mt-1 ${message.incoming ? "text-gray-400" : "text-purple-100"}`}>{message.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}