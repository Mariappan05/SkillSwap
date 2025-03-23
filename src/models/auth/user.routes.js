const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/skills/matching', authMiddleware, userController.findMatchingUsers);

module.exports = router;
