// config/database.js
const mongoose = require('mongoose');

const connection = {};

const connectDB = async () => {
    try {
        if (connection.isConnected) {
            console.log('📡 Using existing database connection');
            return;
        }

        // Updated connection options removing deprecated flags
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        // Connect to MongoDB
        const db = await mongoose.connect(process.env.MONGODB_URI, options);
        
        connection.isConnected = db.connections[0].readyState;
        console.log('🌿 MongoDB Connected:', db.connection.host);

        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('🔗 Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 Mongoose disconnected');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('💤 MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
