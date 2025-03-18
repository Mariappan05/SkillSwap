require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const skillRoutes = require('./routes/skill.routes');
const sessionRoutes = require('./routes/session.routes');
const reviewRoutes = require('./routes/review.routes');
const messageRoutes = require('./routes/messageRoutes'); // Make sure this matches your file name
const videoCallRoutes = require('./routes/videoCallRoutes');
const profileRoutes = require('./routes/profile.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());

// Add error handling for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/video-calls', videoCallRoutes);
app.use('/api/profile', profileRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'SkillSwap API is running'
    });
});

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

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        // Try the next port
        server.listen(PORT + 1);
    } else {
        console.error('Server error:', err);
    }
});

module.exports = server;
