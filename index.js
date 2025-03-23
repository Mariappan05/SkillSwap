require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('express-async-errors');
const http = require('http');
const path = require('path');

// Initialize Express
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'SkillSwap API is running'
  });
});

// Database Connection with connection pooling and caching
let cachedDb = null;
const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }
 
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
   
    cachedDb = connection;
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Import Routes
// Comment these out if the route files don't exist yet

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const skillRoutes = require('./routes/skill.routes');
const sessionRoutes = require('./routes/session.routes');
const reviewRoutes = require('./routes/review.routes');
const messageRoutes = require('./routes/messageRoutes');
const videoCallRoutes = require('./routes/videoCallRoutes');
const profileRoutes = require('./routes/profile.routes');
const notificationRoutes = require('./routes/notificationRoutes');

// Placeholder routes for testing if actual route files don't exist yet
app.get('/api/auth/test', (req, res) => res.json({ message: 'Auth route working' }));
app.get('/api/users/test', (req, res) => res.json({ message: 'Users route working' }));
app.get('/api/skills/test', (req, res) => res.json({ message: 'Skills route working' }));

// Connect to DB before handling routes
app.use(async (req, res, next) => {
  try {
    // For initial deployment, let's make this optional
    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.log('No MongoDB URI provided, skipping database connection');
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection error'
    });
  }
});

// API Route
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/video-calls', videoCallRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `The requested resource at ${req.path} was not found`
  });
});

// IMPORTANT: For Render deployment, we MUST call server.listen()
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  
  // Connect to database after server is running if URI is provided
  if (process.env.MONGODB_URI) {
    connectDB().catch(err => console.error('Failed to connect to MongoDB:', err));
  } else {
    console.log('No MongoDB URI provided, skipping database connection');
  }
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    console.log('Server closed');
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(async () => {
    console.log('Server closed');
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });
});

// Export the Express app for potential serverless functions
module.exports = app;
