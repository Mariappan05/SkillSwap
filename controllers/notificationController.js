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

            if (!fcmToken) {
                return res.status(400).json({
                    success: false,
                    message: 'FCM Token is required'
                });
            }

            // Update user's FCM token in database
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { fcmToken },
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
                message: 'FCM Token updated successfully',
                data: {
                    userId: updatedUser._id,
                    fcmToken: updatedUser.fcmToken
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
                console.error('User not found for notification:', userId);
                return;
            }

            if (!user.fcmToken) {
                console.error('No FCM token found for user:', userId);
                return;
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
