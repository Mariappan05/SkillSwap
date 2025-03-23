// controllers/reviewController.js
const Review = require('../models/Review');
const User = require('../src/models/User');
const Session = require('../models/Session');

const reviewController = {
    createReview: async (req, res) => {
        try {
            const session = await Session.findById(req.params.sessionId);
            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found'
                });
            }

            // Verify user participated in session
            const isParticipant = [session.teacher.toString(), session.student.toString()]
                .includes(req.user.userId);
            if (!isParticipant) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only review sessions you participated in'
                });
            }

            const review = await Review.create({
                ...req.body,
                session: req.params.sessionId,
                author: req.user.userId,
                recipient: req.user.userId === session.teacher.toString() 
                    ? session.student 
                    : session.teacher
            });

            res.status(201).json({
                success: true,
                data: review
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getUserReviews: async (req, res) => {
        try {
            const { userId } = req.params;

            const reviews = await Review.find({
                to: userId
            }).populate('from', 'username');

            res.status(200).json({
                success: true,
                data: reviews
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getSessionReview: async (req, res) => {
        try {
            const { sessionId } = req.params;

            const review = await Review.findOne({
                session: sessionId
            }).populate('from to', 'username');

            res.status(200).json({
                success: true,
                data: review
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getReceivedReviews: async (req, res) => {
        try {
            const reviews = await Review.find({ recipient: req.user.userId })
                .populate('author', 'fullName email')
                .populate('session');

            res.json({
                success: true,
                data: reviews
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getGivenReviews: async (req, res) => {
        try {
            const reviews = await Review.find({ author: req.user.userId })
                .populate('recipient', 'fullName email')
                .populate('session');

            res.json({
                success: true,
                data: reviews
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateReview: async (req, res) => {
        try {
            const review = await Review.findOneAndUpdate(
                {
                    _id: req.params.id,
                    author: req.user.userId
                },
                req.body,
                { new: true }
            );

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found or unauthorized'
                });
            }

            res.json({
                success: true,
                data: review
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteReview: async (req, res) => {
        try {
            const review = await Review.findOneAndDelete({
                _id: req.params.id,
                author: req.user.userId
            });

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found or unauthorized'
                });
            }

            res.json({
                success: true,
                data: {}
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = reviewController;
