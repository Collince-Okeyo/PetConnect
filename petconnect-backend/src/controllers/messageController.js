const Message = require('../models/Message');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/messages';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isImage = allowedImageTypes.test(extname) && mimetype.startsWith('image/');
  const isDoc = allowedDocTypes.test(extname) && (mimetype.includes('pdf') || mimetype.includes('document'));

  if (isImage || isDoc) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (jpg, png, gif, webp) and documents (pdf, doc, docx) are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  fileFilter: fileFilter
});

// Export upload middleware for use in routes
exports.uploadMiddleware = upload.array('files', 5);

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('📋 Fetching conversations for user:', userId);
    console.log('📋 User ID type:', typeof userId, userId.constructor.name);

    // Aggregate to get unique conversations with last message
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversation',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiver', userId] },
                  { $eq: ['$isRead', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    console.log(`✅ Found ${conversations.length} conversations`);
    console.log('📊 Raw conversations:', JSON.stringify(conversations, null, 2));

    console.log('✅ Found ${conversations.length} conversations');
    console.log('📊 Raw conversations:', JSON.stringify(conversations, null, 2));

    // Populate user details
    console.log('🔄 Populating user details...');
    await Message.populate(conversations, [
      { path: 'lastMessage.sender', select: 'name profilePicture' },
      { path: 'lastMessage.receiver', select: 'name profilePicture' }
    ]);
    console.log('✅ Population complete');

    console.log('🔄 Formatting conversations...');

    const formattedConversations = conversations.map(conv => {
      try {
        // Check if sender and receiver exist (they might be null if users were deleted)
        if (!conv.lastMessage.sender || !conv.lastMessage.receiver) {
          console.log('⚠️ Skipping conversation - sender or receiver is null');
          return null;
        }

        const otherUser = conv.lastMessage.sender._id.toString() === userId.toString()
          ? conv.lastMessage.receiver
          : conv.lastMessage.sender;

        // Determine what to show as last message content
        let lastMessageContent = conv.lastMessage.content || '';
        
        // If no text content but has attachments, show placeholder
        if (!lastMessageContent) {
          const attachments = conv.lastMessage.attachments;
          
          if (attachments && Array.isArray(attachments) && attachments.length > 0) {
            const attachmentCount = attachments.length;
            const firstAttachment = attachments[0];
            
            if (firstAttachment && firstAttachment.type === 'image') {
              lastMessageContent = attachmentCount > 1 
                ? `📷 ${attachmentCount} photos` 
                : '📷 Photo';
            } else if (firstAttachment) {
              lastMessageContent = attachmentCount > 1 
                ? `📎 ${attachmentCount} files` 
                : '📎 File';
            }
          }
        }

        return {
          conversationId: conv._id,
          otherUser,
          lastMessage: {
            content: lastMessageContent,
            createdAt: conv.lastMessage.createdAt,
            isRead: conv.lastMessage.isRead
          },
          unreadCount: conv.unreadCount
        };
      } catch (err) {
        console.error('Error formatting conversation:', err);
        console.error('Problematic conversation:', JSON.stringify(conv, null, 2));
        // Return a safe default if there's an error
        return null;
      }
    }).filter(conv => conv !== null); // Remove any null entries

    console.log(`✅ Formatted ${formattedConversations.length} conversations successfully`);
    console.log('📤 Sending response...');

    res.status(200).json({
      success: true,
      data: {
        conversations: formattedConversations
      }
    });
    
    console.log('✅ Response sent successfully');
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

// Get messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;

    // Generate conversation ID
    const conversationId = Message.generateConversationId(userId, otherUserId);

    // Fetch messages
    const messages = await Message.find({
      conversation: conversationId
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture');

    res.status(200).json({
      success: true,
      data: {
        messages
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, content } = req.body;
    const files = req.files; // Array of files from multer

    // Validate that we have either content or files
    const hasContent = content && content.trim();
    const hasFiles = files && files.length > 0;
    
    if (!hasContent && !hasFiles) {
      return res.status(400).json({
        success: false,
        message: 'Message must have content or attachment'
      });
    }

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Generate conversation ID
    const conversationId = Message.generateConversationId(senderId, receiverId);

    // Prepare message data
    const messageData = {
      conversation: conversationId,
      sender: senderId,
      receiver: receiverId,
      content: hasContent ? content.trim() : ''
    };

    // Add attachments if files were uploaded
    if (hasFiles) {
      messageData.attachments = files.map(file => ({
        type: file.mimetype.startsWith('image/') ? 'image' : 'document',
        url: file.path.replace(/\\/g, '/'),
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype
      }));
    }

    // Create message
    const message = await Message.create(messageData);

    // Populate sender and receiver details
    await message.populate('sender', 'name profilePicture');
    await message.populate('receiver', 'name profilePicture');

    res.status(201).json({
      success: true,
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;

    const conversationId = Message.generateConversationId(userId, otherUserId);

    const result = await Message.updateMany(
      {
        conversation: conversationId,
        receiver: userId,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting unread count',
      error: error.message
    });
  }
};
