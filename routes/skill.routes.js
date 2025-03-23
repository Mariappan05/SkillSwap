const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const skillController = require('../controllers/skillController');

// Public routes
router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillById);

// Protected routes
router.post('/', protect, skillController.createSkill);
router.put('/:id', protect, skillController.updateSkill);
router.delete('/:id', protect, skillController.deleteSkill);

module.exports = router;
