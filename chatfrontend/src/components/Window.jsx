import React, { useEffect } from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

import MessageBar from './MessageBar';
import WindowTopBar from './ui/WindowTopBar';
import { connectSocket, getSocket } from '@/lib/socket';

import IncomingMsg from './ui/IncomingMsg';
import OutgoingMsg from './ui/OutgoingMsg';
import SystemMSG from './ui/SystemMSG';

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
      setMessages(res.messages);
    };

    socket.on("fetchMessages", handleFetch);

    // No additional socket.on
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      connectSocket(userId);
      return;
    }

    const handleFetchMsg = (res) => {
      setMessages(res.messages);
      console.log("CLIENT RECEIVED:", res.messages.length);
    };

    socket.on("fetchMessages", handleFetchMsg);

    if (selectedChat?.chatId && userId) {
      socket.emit("fetchMessages", { chatId: selectedChat.chatId, userId });
    }

    return () => {
      socket.off("fetchMessages", handleFetchMsg);
    };
  }, [selectedChat, userId]);

  // Grouping logic
  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach(msg => {
      const date = parseISO(msg.createdAt);
      let label = format(date, 'yyyy-MM-dd');

      if (isToday(date)) {
        label = 'Today';
      } else if (isYesterday(date)) {
        label = 'Yesterday';
      } else {
        label = format(date, 'MMMM d, yyyy');
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(msg);
    });

    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className='w-full md:w-[80%] h-full bg-[#F6F6F6] md:rounded-md relative overflow-hidden'>

      <div className='w-full h-[90%] md:h-[85%] overflow-hidden flex flex-col items-center justify-center'>

        <WindowTopBar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

        <div className="w-full h-[77%] absolute bottom-20 flex flex-col gap-2 p-4 overflow-y-auto max-h-full">
          {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
            <div key={dateLabel}>
              <div className="text-center text-xs text-gray-500 my-2">{dateLabel}</div>

              {msgs.map((msg, index) => {
                const isSender = msg.sender === userId;
                return isSender ? (
                  <OutgoingMsg key={msg._id || index} msg={msg.message} time={msg.time} />
                ) : (
                  <IncomingMsg key={msg._id || index} msg={msg.message} time={msg.time} />
                );
              })}
            </div>
          ))}
        </div>


      </div>

      <MessageBar
        onSend={onSend}
        message={message}
        setMessage={setMessage}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
    </div>
  );
}
