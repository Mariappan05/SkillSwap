const socketIo = require('socket.io');

function setupSocketIO(server) {
  const io = socketIo(server);

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

  return io;
}

module.exports = setupSocketIO;
