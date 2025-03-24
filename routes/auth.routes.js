const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.protect, authController.getMe);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
