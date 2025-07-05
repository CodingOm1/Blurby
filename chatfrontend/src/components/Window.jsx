import React, { useEffect } from 'react'
import MessageBar from './MessageBar'
import WindowTopBar from './ui/WindowTopBar'
import { connectSocket, getSocket } from '@/lib/socket';
import IncomingMsg from './ui/IncomingMsg';
import OutgoingMsg from './ui/OutgoingMsg';

export default function Page({ setSelectedChat, selectedChat, message, setMessage, messages, userId, setMessages }) {


  const onSend = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("sendMessage", {
      userId,
      targetUserId: selectedChat.targetUser._id,
      message
    });
    const handleFetch = (res) => {
      setMessages(res.messages)
    }
    socket.on("fetchMessages", handleFetch)

    // Do NOT add any socket.on here!
  };


  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      connectSocket(userId);
      return;
    }

    const handleFetchMsg = (res) => {
      setMessages(res.messages);
      // Debug:
      console.log("CLIENT RECEIVED:", res.messages.length);
    };

    // Always listen for fetchMessages
    socket.on("fetchMessages", handleFetchMsg);

    // Fetch messages when chat changes
    if (selectedChat?.chatId && userId) {
      socket.emit("fetchMessages", { chatId: selectedChat.chatId, userId });
    }

    return () => {
      socket.off("fetchMessages", handleFetchMsg);
    };
  }, [selectedChat, userId]);


  return (
    <div className='w-full md:w-[80%] h-full bg-[#F6F6F6] md:rounded-md relative overflow-hidden  ' >
      <div className='w-full h-[90%] md:h-[85%] overflow-hidden overflow-x-hidden  flex flec-col items-center justify-center'>

        <WindowTopBar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

        <div className="w-full h-[77%] absolute bottom-20  flex flex-col gap-2 p-4 overflow-y-auto max-h-full">
          {messages.map((msg, index) => {
            const isSender = msg.sender === userId;

            if (isSender) {
              return <OutgoingMsg key={msg._id || index} msg={msg.message} time={msg.time} />;
            } else {
              return <IncomingMsg key={msg._id || index} msg={msg.message} time={msg.time} />;
            }
          })}
        </div>


      </div>
      <MessageBar onSend={onSend} message={message} setMessage={setMessage} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
    </div>
  )
}
