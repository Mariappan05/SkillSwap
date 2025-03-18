const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const videoCallController = require('../controllers/videoCallController');

router.post('/initiate', protect, videoCallController.initiateCall);
router.post('/signal', protect, videoCallController.handleSignal);
router.post('/end', protect, videoCallController.endCall);
router.get('/active-calls', protect, videoCallController.getActiveCalls);

module.exports = router;
