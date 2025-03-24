const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

// Explicitly define PUT method for profile update
router.route('/update')
  .put(protect, profileController.updateProfile);

router.route('/')
  .get(protect, profileController.getProfile);

module.exports = router;