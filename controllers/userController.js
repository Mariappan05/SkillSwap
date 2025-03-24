const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

const userController = {
    searchUsers: async (req, res) => {
        try {
            const { query } = req.query;
            const users = await User.find({
                $or: [
                    { fullName: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            }).select('-password');
            
            res.json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { $set: req.body },
                { new: true }
            ).select('-password');
            
            res.json({ success: true, data: updatedUser });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.userId).select('-password');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    addSkill: async (req, res) => {
        try {
            const { skillName, proficiency } = req.body;
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $push: { skills: { name: skillName, proficiency } } },
                { new: true }
            ).select('-password');
            
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    removeSkill: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $pull: { skills: { _id: req.params.skillId } } },
                { new: true }
            ).select('-password');
            
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = userController;
