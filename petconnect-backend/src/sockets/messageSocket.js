const jwt = require('jsonwebtoken');

// Socket.io authentication middleware
const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

// Socket.io message event handlers
const setupMessageSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room for notifications
    socket.join(`user:${socket.userId}`);

    // Join a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Send message
    socket.on('send_message', (data) => {
      const { conversationId, message } = data;
      
      // Broadcast to conversation room (except sender)
      socket.to(`conversation:${conversationId}`).emit('new_message', message);
      
      // Also send to receiver's personal room for notifications
      if (message.receiver && message.receiver._id) {
        io.to(`user:${message.receiver._id}`).emit('message_notification', {
          conversationId,
          message
        });
      }
    });

    // Typing indicators
    socket.on('typing_start', (data) => {
      const { conversationId, userName } = data;
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: socket.userId,
        userName,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: socket.userId,
        isTyping: false
      });
    });

    // Mark messages as read
    socket.on('messages_read', (data) => {
      const { conversationId, messageIds } = data;
      socket.to(`conversation:${conversationId}`).emit('messages_marked_read', {
        messageIds,
        readBy: socket.userId
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

module.exports = { socketAuth, setupMessageSocket };
