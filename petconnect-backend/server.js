const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import cleanup service
const onlineStatusCleanup = require('./src/services/onlineStatusCleanup');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting - more permissive in development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // 10,000 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3005',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173'
    ];
    
    // Allow any local network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    const localNetworkRegex = /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):\d+$/;
    
    if (allowedOrigins.indexOf(origin) !== -1 || localNetworkRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads - with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PetConnect API',
    version: '1.0.0',
    status: 'Server is running!'
  });
});

// Serve static files from uploads directory
app.use('/app/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Import routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/pets', require('./src/routes/pets'));
app.use('/api/pet-types', require('./src/routes/petTypes'));
app.use('/api/temperaments', require('./src/routes/temperaments'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/walks', require('./src/routes/walks'));
app.use('/api/notifications', require('./src/routes/notifications'));
app.use('/api/messages', require('./src/routes/messages'));
app.use('/api/verification', require('./src/routes/verification'));
app.use('/api/admin/verifications', require('./src/routes/adminVerification'));
// app.use('/api/payments', require('./src/routes/payments'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server
const http = require('http');
const server = http.createServer(app);

// Setup Socket.io
const { Server } = require('socket.io');
const { socketAuth, setupMessageSocket } = require('./src/sockets/messageSocket');

const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3005',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://192.168.100.174:3000',
        'http://192.168.100.174:5173',
      ];
      
      const localNetworkRegex = /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):\d+$/;
      
      if (allowedOrigins.indexOf(origin) !== -1 || localNetworkRegex.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  }
});
// Socket.io authentication
io.use(socketAuth);

// Setup message socket handlers
setupMessageSocket(io);

// Make io accessible to routes
app.set('io', io);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.io is ready for real-time messaging`);
  console.log(`🌐 Accessible on network at http://0.0.0.0:${PORT}`);
  
  // Start online status cleanup service
  onlineStatusCleanup.start();
});
