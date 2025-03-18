const admin = require('firebase-admin');

const notificationController = {
    updateFCMToken: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { fcmToken } = req.body;

            // Update user's FCM token in database
            await User.findByIdAndUpdate(userId, { fcmToken });

            res.status(200).json({
                success: true,
                message: 'FCM Token updated'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Token update failed'
            });
        }
    },

    sendPushNotification: async (userId, title, body) => {
        try {
            const user = await User.findById(userId);
            
            if (user && user.fcmToken) {
                const message = {
                    notification: { title, body },
                    token: user.fcmToken
                };

                await admin.messaging().send(message);
            }
        } catch (error) {
            console.error('Notification error:', error);
        }
    }
};

module.exports = notificationController;
