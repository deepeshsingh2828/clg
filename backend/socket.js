const Message = require('./models/Message');

module.exports = (io) => {
  // Store connected users mapping userId -> socketId
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // User joins with their DB user ID
    socket.on('setup', (userData) => {
      if(userData && userData._id) {
        socket.join(userData._id);
        connectedUsers.set(userData._id, socket.id);
        socket.emit('connected');
      }
    });

    socket.on('join chat', (room) => {
      socket.join(room);
      console.log('User Joined Room: ' + room);
    });

    socket.on('new message', (newMessageReceived) => {
      var chat = newMessageReceived.chat; // Custom logic, typically receiver ID

      if (!newMessageReceived.receiver) return console.log('chat.users not defined');

      // Emit to the specific receiver socket room
      socket.in(newMessageReceived.receiver).emit('message received', newMessageReceived);
    });

    socket.on('disconnect', () => {
      console.log('USER DISCONNECTED');
      // For cleanup, one would iterate or find reverse mapping
    });
  });
};
