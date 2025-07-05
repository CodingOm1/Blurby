import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { getSocket, connectSocket } from '@/lib/socket';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';

export default function NewChat({ userId, setFinderOpen, setSelectedChat }) {
  const [phone, setPhone] = useState('');
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("User not authenticated");
      return;
    }

    const socket = getSocket();
    if (!socket) connectSocket(userId);
  }, [userId]);

  useEffect(() => {
    if (phone.length !== 10) {
      setNewUser(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const socket = getSocket();
    if (!socket) {
      connectSocket(userId);
      return;
    }

    socket.emit('find-user-with-phone', { userId, phone });

    const handleUserFound = (response) => {
      if (response.status === 'good') {
        setNewUser(response.result);
        setError(null);
      } else {
        setNewUser(null);
        setError(response.message || "User not found");
      }
      setIsLoading(false);
    };

    socket.on('find-user-with-phone', handleUserFound);


    return () => {
      socket.off('find-user-with-phone', handleUserFound);
    };
  }, [phone, userId]);

  const registerChat = async () => {
    if (!newUser || !newUser._id) {
      setError("Invalid user selected");
      return;
    }

    setIsLoading(true);
    const socket = getSocket();

    try {
      socket.emit("create-new-chat", {
        userId,
        targetedId: newUser._id
      });

      const handleChatCreated = (response) => {
        if (response.status === 'good') {
          toast.success("Chat created successfully!");
          // setFinderOpen(false);
          console.log(response)
          
        } else {
          setError(response.message || "Failed to create chat");
        }
        setIsLoading(false);
      };

      socket.on("create-new-chat", handleChatCreated);
    

    } catch (err) {
      setError(err.message || "Error creating chat");
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full h-screen fixed top-0 left-0 backdrop-blur-[2px] bg-[#00000023] z-30'>
      <div className='w-full h-screen flex items-center justify-center relative'>
        <div className='w-[500px] max-h-[400px] py-5 bg-white rounded-xl p-5 flex flex-col items-center justify-center gap-5 shadow-md'>
          <div className='flex items-center w-full gap-2'>
            <CiSearch className='text-2xl' />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              minLength={10}
              maxLength={10}
              type="tel"
              placeholder='Search Phone Number'
              className='w-full px-5 py-2 outline-none border border-gray-300 rounded-3xl focus:border-purple-500'
            />
            <IoMdClose
              onClick={() => setFinderOpen(false)}
              className='cursor-pointer text-xl text-gray-600'
            />
          </div>

          <div className='flex flex-col gap-2 w-full max-h-full overflow-x-hidden px-5 py-2'>
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-2">{error}</div>
            ) : !newUser ? (
              <h2 className='text-gray-500 text-center py-2'>
                {phone.length === 10 ? "Searching..." : "Enter a 10-digit phone number"}
              </h2>
            ) : (
              <div
                onClick={registerChat}
                className='flex relative items-center justify-start gap-2 hover:bg-zinc-200 w-full px-5 rounded-xl select-none cursor-pointer py-[5px] transition-colors'
              >
                <div className='w-12 h-12 border rounded-full border-zinc-500 overflow-hidden'>
                  <img
                    src={newUser.profileImg || '/normaldm.jpg'}
                    className='rounded-full object-cover w-full h-full scale-[1.2]'
                    alt={newUser.firstName}
                    onError={(e) => {
                      e.target.src = '/normaldm.jpg';
                    }}
                  />
                </div>
                <div className='flex flex-col justify-between py-2'>
                  <h2 className='font-inter text-[15px]'>
                    {`${newUser.firstName || ''} ${newUser.lastName || ''}`.trim() || 'Unknown User'}
                  </h2>
                  <p className='text-[12px] text-gray-600'>{newUser.phone || ''}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}