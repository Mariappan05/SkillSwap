const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Debug middleware for notification routes
router.use((req, res, next) => {
    console.log('Notification Route Debug:');
    console.log('- Method:', req.method);
    console.log('- URL:', req.url);
    console.log('- Path:', req.path);
    console.log('- Headers:', req.headers);
    console.log('- Body:', req.body);
    next();
});

// Update FCM token
router.post('/update-fcm-token', auth, notificationController.updateFCMToken);

// Send test notification
router.post('/send-test', auth, (req, res, next) => {
    console.log('Send test notification route hit');
    next();
}, notificationController.testNotification);

// Add a test route to verify the router is working
router.get('/test', (req, res) => {
    console.log('Test route hit');
    res.json({ 
        success: true,
        message: 'Notification routes are working',
        path: req.path,
        method: req.method,
        availableRoutes: {
            'POST /update-fcm-token': 'Update FCM token (requires auth)',
            'POST /send-test': 'Send test notification (requires auth)',
            'GET /test': 'This test endpoint'
        }
    });
});

module.exports = router;
