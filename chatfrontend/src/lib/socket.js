import { io } from 'socket.io-client';

let socket;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKETSERVER, { transports: ['websocket'] });
    socket.emit('joinRoom', userId);
  }
};

export const getSocket = () => socket;
