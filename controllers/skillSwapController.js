const SkillSwapRequest = require('../models/SkillSwapRequest');
const User = require('../models/User');

const skillSwapController = {
    sendSkillSwapRequest: async (req, res) => {
        try {
            const { receiverId, senderSkill, receiverSkill } = req.body;
            const senderId = req.user.userId;

            const request = await SkillSwapRequest.create({
                sender: senderId,
                receiver: receiverId,
                senderSkill,
                receiverSkill
            });

            res.status(201).json({
                success: true,
                request
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Skill swap request failed',
                error: error.message
            });
        }
    },

    findMatchingUsers: async (req, res) => {
        try {
            const { skill } = req.query;
            
            const matchingUsers = await User.find({
                $or: [
                    { 'skills.teaching': { $elemMatch: { name: skill } } },
                    { 'skills.learning': { $elemMatch: { name: skill } } }
                ]
            });

            res.status(200).json({
                success: true,
                users: matchingUsers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'User search failed',
                error: error.message
            });
        }
    }
};

module.exports = skillSwapController;
