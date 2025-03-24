// controllers/skillController.js
const UserModel = require('../models/User');
const Skill = require('../models/Skill');

const skillController = {
    findMatches: async (req, res) => {
        try {
            const { skills } = req.body;
            const matchingUsers = await User.find({
                'profile.skills.canTeach': { $in: skills }
            }).select('-password');

            res.status(200).json({
                success: true,
                data: matchingUsers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    createRequest: async (req, res) => {
        try {
            const { mentorId, skill } = req.body;
            const learnerId = req.user.userId;

            const skillRequest = await SkillRequest.create({
                mentor: mentorId,
                learner: learnerId,
                skill: skill,
                status: 'PENDING'
            });

            res.status(201).json({
                success: true,
                data: skillRequest
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getSkillRequests: async (req, res) => {
        try {
            const userId = req.user.userId;
            const requests = await SkillRequest.find({
                $or: [
                    { mentor: userId },
                    { learner: userId }
                ]
            }).populate('mentor learner', 'username email');

            res.status(200).json({
                success: true,
                data: requests
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllSkills: async (req, res) => {
        try {
            const skills = await Skill.find();
            res.json({ success: true, data: skills });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getSkillById: async (req, res) => {
        try {
            const skill = await Skill.findById(req.params.id);
            if (!skill) {
                return res.status(404).json({ success: false, message: 'Skill not found' });
            }
            res.json({ success: true, data: skill });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    createSkill: async (req, res) => {
        try {
            const skill = await Skill.create(req.body);
            res.status(201).json({ success: true, data: skill });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateSkill: async (req, res) => {
        try {
            const skill = await Skill.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!skill) {
                return res.status(404).json({ success: false, message: 'Skill not found' });
            }
            res.json({ success: true, data: skill });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteSkill: async (req, res) => {
        try {
            const skill = await Skill.findByIdAndDelete(req.params.id);
            if (!skill) {
                return res.status(404).json({ success: false, message: 'Skill not found' });
            }
            res.json({ success: true, data: {} });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = skillController;
