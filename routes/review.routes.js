const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// Protected review routes
router.get('/received', protect, reviewController.getReceivedReviews);
router.get('/given', protect, reviewController.getGivenReviews);
router.post('/session/:sessionId', protect, reviewController.createReview);
router.put('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
