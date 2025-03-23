const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

// Base route handler to test the endpoint
router.get('/', (req, res) => {
    res.json({ message: 'Message routes working' });
});

// Protected routes
router.post('/conversation', protect, messageController.createConversation);
router.get('/conversations', protect, messageController.getUserConversations);
router.get('/conversation/:conversationId', protect, messageController.getConversation);
router.post('/send', protect, messageController.sendMessage);

module.exports = router;
