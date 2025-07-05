import { io } from 'socket.io-client';

let socket;

export const connectSocket = (userId) => {
  if (!userId) {
    console.warn("Invalid userId passed to connectSocket:", userId);
    return;
  }

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKETSERVER, {
      transports: ['websocket'],
    });

    // ⬇️ use captured value
    socket.on('connect', () => {
      console.log("🔌 Connected:", socket.id);
      console.log("📤 Emitting joinRoom with:", userId);
      socket.emit('joinRoom', userId); // now userId will be correct
    });
  }
};

export const getSocket = () => socket;
