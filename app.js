const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const profileRoutes = require('./routes/profileRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', profileRoutes); 

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Connect to Database
connectDB();

// Mount routes with /api prefix
app.use('/api', apiRoutes);
app.use('/api', require('./routes/forgotPassword'));
app.use('/api', require('./routes/profileRoutes'));



// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error' 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
