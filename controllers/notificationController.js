const admin = require('firebase-admin');
const User = require('../models/User');
const { initializeFirebase } = require('../config/firebaseConfig');

// Initialize Firebase Admin
initializeFirebase();

const notificationController = {
    updateFCMToken: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { fcmToken } = req.body;

            // Allow empty FCM token to clear the token
            const updateData = fcmToken ? { fcmToken } : { $unset: { fcmToken: 1 } };

            // Update user's FCM token in database
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: fcmToken ? 'FCM Token updated successfully' : 'FCM Token cleared successfully',
                data: {
                    userId: updatedUser._id,
                    fcmToken: updatedUser.fcmToken || null
                }
            });
        } catch (error) {
            console.error('FCM Token update error:', error);
            res.status(500).json({
                success: false,
                message: 'Token update failed',
                error: error.message
            });
        }
    },

    sendPushNotification: async (userId, title, body) => {
        try {
            const user = await User.findById(userId);
            
            if (!user) {
                throw new Error('User not found');
            }

            if (!user.fcmToken) {
                console.log('No FCM token found for user:', userId);
                return null; // Return null instead of throwing error for missing token
            }

            const message = {
                notification: { 
                    title, 
                    body,
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK'
                },
                token: user.fcmToken,
                data: {
                    userId: userId.toString(),
                    type: 'message',
                    timestamp: new Date().toISOString()
                }
            };

            const response = await admin.messaging().send(message);
            console.log('Successfully sent notification:', response);
            return response;
        } catch (error) {
            console.error('Notification error:', error);
            throw error;
        }
    }
};

module.exports = notificationController;
