const express = require('express');
const router = express.Router();
const skillController = require('./skill.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/match', authMiddleware, skillController.findMatches);
router.post('/request', authMiddleware, skillController.createSkillRequest);

module.exports = router;