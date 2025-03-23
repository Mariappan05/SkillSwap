// controllers/sessionController.js
const User = require('../src/models/User');
const Session = require('../models/Session');

const sessionController = {
    createSession: async (req, res) => {
        try {
            const session = await Session.create({
                ...req.body,
                teacher: req.user.userId
            });
            
            res.status(201).json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getMySessions: async (req, res) => {
        try {
            const sessions = await Session.find({
                $or: [
                    { teacher: req.user.userId },
                    { student: req.user.userId }
                ]
            }).populate('teacher student skill', 'fullName email name');

            res.json({
                success: true,
                data: sessions
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getSessionById: async (req, res) => {
        try {
            const session = await Session.findById(req.params.id)
                .populate('teacher student skill', 'fullName email name');

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found'
                });
            }

            res.json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateSession: async (req, res) => {
        try {
            const session = await Session.findOneAndUpdate(
                {
                    _id: req.params.id,
                    teacher: req.user.userId
                },
                req.body,
                { new: true }
            );

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found or unauthorized'
                });
            }

            res.json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteSession: async (req, res) => {
        try {
            const session = await Session.findOneAndDelete({
                _id: req.params.id,
                teacher: req.user.userId
            });

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found or unauthorized'
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
    },

    bookSession: async (req, res) => {
        try {
            const session = await Session.findOneAndUpdate(
                {
                    _id: req.params.id,
                    student: { $exists: false }
                },
                { student: req.user.userId },
                { new: true }
            );

            if (!session) {
                return res.status(400).json({
                    success: false,
                    message: 'Session not available for booking'
                });
            }

            res.json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = sessionController;
