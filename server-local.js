// This file is ONLY for local development, not for Vercel deployment
const http = require('http');
const app = require('./index');
const socketIo = require('socket.io');

// Only run this in development
if (process.env.NODE_ENV === 'development') {
  const server = http.createServer(app);
  const io = socketIo(server);

  // Socket.io Connection Handler
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join user's personal room
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    // Handle messaging
    socket.on('send-message', (messageData) => {
      socket.to(messageData.receiverId).emit('new-message', messageData);
    });

    // Handle video call signaling
    socket.on('call-user', (callData) => {
      socket.to(callData.receiverId).emit('incoming-call', callData);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server with Socket.IO running on port ${PORT}`);
  });
}
