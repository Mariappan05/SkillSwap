// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Public routes
router.get('/search', userController.searchUsers);

// Protected routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.get('/:userId', protect, userController.getUserById);
router.post('/skills', protect, userController.addSkill);
router.delete('/skills/:skillId', protect, userController.removeSkill);

module.exports = router;
