const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/', authMiddleware, reviewController.createReview);
router.get('/user/:userId', authMiddleware, reviewController.getUserReviews);

module.exports = router;
