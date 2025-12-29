const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const messageController = require('../controllers/messageController');

// All routes require authentication
router.use(protect);

// Get all conversations for logged-in user
router.get('/conversations', messageController.getConversations);

// Get messages for a specific conversation
router.get('/:otherUserId', messageController.getMessages);

// Send a message (with optional file attachments - up to 5 files)
router.post('/send', messageController.uploadMiddleware, messageController.sendMessage);

// Mark messages as read
router.put('/:otherUserId/read', messageController.markAsRead);

// Get unread message count
router.get('/unread/count', messageController.getUnreadCount);

module.exports = router;
