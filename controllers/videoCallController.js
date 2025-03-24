const VideoCall = require('../models/VideoCall');
const User = require('../models/User');

const videoCallController = {
    initiateCall: async (req, res) => {
        try {
            const { recipientId, sessionId } = req.body;
            
            const call = await VideoCall.create({
                initiator: req.user.userId,
                recipient: recipientId,
                session: sessionId,
                status: 'initiated'
            });

            res.status(201).json({
                success: true,
                data: call
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    handleSignal: async (req, res) => {
        try {
            const { callId, signal, type } = req.body;
            
            const call = await VideoCall.findById(callId);
            if (!call) {
                return res.status(404).json({
                    success: false,
                    message: 'Call not found'
                });
            }

            // Verify user is part of the call
            if (![call.initiator.toString(), call.recipient.toString()].includes(req.user.userId)) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to access this call'
                });
            }

            res.json({
                success: true,
                data: { signal, type }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    endCall: async (req, res) => {
        try {
            const { callId } = req.body;
            
            const call = await VideoCall.findOneAndUpdate(
                {
                    _id: callId,
                    $or: [
                        { initiator: req.user.userId },
                        { recipient: req.user.userId }
                    ]
                },
                { status: 'ended', endedAt: Date.now() },
                { new: true }
            );

            if (!call) {
                return res.status(404).json({
                    success: false,
                    message: 'Call not found or unauthorized'
                });
            }

            res.json({
                success: true,
                data: call
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getActiveCalls: async (req, res) => {
        try {
            const calls = await VideoCall.find({
                $or: [
                    { initiator: req.user.userId },
                    { recipient: req.user.userId }
                ],
                status: 'initiated'
            }).populate('initiator recipient session');

            res.json({
                success: true,
                data: calls
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateCallStatus: async (req, res) => {
        try {
            const { callId } = req.params;
            const { status, endTime } = req.body;

            const videoCall = await VideoCall.findByIdAndUpdate(
                callId,
                { 
                    status, 
                    endTime
                },
                { new: true }
            );

            res.status(200).json({
                success: true,
                videoCall
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Updating video call failed',
                error: error.message
            });
        }
    }
};

module.exports = videoCallController;
