const express = require('express');
const router = express.Router();
const sessionController = require('./session.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/schedule', authMiddleware, sessionController.scheduleSession);
router.get('/upcoming', authMiddleware, sessionController.getUpcomingSessions);

module.exports = router;
