const express = require('express');
const router = express.Router();
const SkillSwapController = require('../controllers/skillSwapController');
const authMiddleware = require('../middleware/authMiddleware');

// Send Skill Swap Request
router.post('/request', authMiddleware.protect, SkillSwapController.sendSkillSwapRequest);

// Get Skill Swap Requests
router.get('/requests', authMiddleware.protect, SkillSwapController.getSkillSwapRequests);

// Accept/Reject Skill Swap Request
router.put('/request/:requestId', authMiddleware.protect, SkillSwapController.updateSkillSwapRequest);

module.exports = router;
