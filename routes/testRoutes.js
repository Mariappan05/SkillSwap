const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Test route to update FCM token
router.post('/update-fcm-token', notificationController.updateFCMToken);

// Test route to send notification
router.post('/send-notification', async (req, res) => {
    try {
        const { userId, title, body } = req.body;
        await notificationController.sendPushNotification(userId, title, body);
        res.status(200).json({
            success: true,
            message: 'Notification sent successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send notification',
            error: error.message
        });
    }
});

module.exports = router; 