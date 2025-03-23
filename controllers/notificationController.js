const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin
const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const notificationController = {
    // Update FCM token
    updateFCMToken: async (req, res) => {
        try {
            const { fcmToken } = req.body;
            const userId = req.user.id;

            console.log('Updating FCM token for user:', userId);
            console.log('New FCM token:', fcmToken);

            if (!fcmToken) {
                return res.status(400).json({
                    success: false,
                    message: 'FCM token is required'
                });
            }

            // Update user's FCM token
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

            console.log('FCM token updated successfully for user:', userId);
            res.json({
                success: true,
                message: 'FCM token updated successfully',
                data: {
                    userId: updatedUser._id,
                    fcmToken: updatedUser.fcmToken
                }
            });
        } catch (error) {
            console.error('Error updating FCM token:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating FCM token'
            });
        }
    },

    // Send test notification
    testNotification: async (req, res) => {
        try {
            const { userId, title, body } = req.body;

            console.log('Attempting to send notification to user:', userId);
            console.log('Notification details:', { title, body });

            if (!userId || !title || !body) {
                return res.status(400).json({
                    success: false,
                    message: 'userId, title, and body are required'
                });
            }

            // Get user's FCM token
            const user = await User.findById(userId);
            console.log('Found user:', user ? 'Yes' : 'No');
            if (user) {
                console.log('User FCM token:', user.fcmToken ? 'Present' : 'Missing');
            }

            if (!user || !user.fcmToken) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found or FCM token not set',
                    details: {
                        userExists: !!user,
                        hasFcmToken: user ? !!user.fcmToken : false
                    }
                });
            }

            // Send notification
            const message = {
                notification: {
                    title,
                    body
                },
                token: user.fcmToken
            };

            console.log('Sending notification with message:', message);
            const response = await admin.messaging().send(message);
            console.log('Notification sent successfully:', response);

            res.json({
                success: true,
                message: 'Notification sent successfully',
                response
            });
        } catch (error) {
            console.error('Error sending notification:', error);
            res.status(500).json({
                success: false,
                message: 'Error sending notification',
                error: error.message
            });
        }
    }
};

module.exports = notificationController;
