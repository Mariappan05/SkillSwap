const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
    register: async (req, res) => {
        try {
            const { fullName, email, password } = req.body;

            // Check if user exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Create user with basic info only
            const user = await User.create({
                fullName,
                email,
                password
            });

            // Generate token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.status(201).json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        profileCompleted: false
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validate email and password
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
                });
            }

            // Find user and include password
            const user = await User.findOne({ email }).select('+password');
            
            // Log for debugging
            console.log('Login attempt:', { email, userFound: !!user });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check password match
            const isMatch = await user.matchPassword(password);
            
            // Log for debugging
            console.log('Password match:', isMatch);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email
                    }
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    },

    protect: async (req, res, next) => {
        try {
            // Get token from header
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No token, authorization denied'
                });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { userId: decoded.userId };
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }
    },

    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.userId).select('-password');
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // New method to update user profile
    updateProfile: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { 
                fullName, 
                bio, 
                contactInfo, 
                skills, 
                availableTimeSlots,
                role 
            } = req.body;

            const updateData = {};
            if (fullName) updateData.fullName = fullName;
            if (bio) updateData.bio = bio;
            if (contactInfo) updateData.contactInfo = contactInfo;
            if (skills) updateData.skills = skills;
            if (availableTimeSlots) updateData.availableTimeSlots = availableTimeSlots;
            if (role) updateData.role = role;

            const user = await User.findByIdAndUpdate(
                userId, 
                updateData, 
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    bio: user.bio,
                    contactInfo: user.contactInfo,
                    skills: user.skills,
                    availableTimeSlots: user.availableTimeSlots
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Profile update failed',
                error: error.message
            });
        }
    },

    // New method to add skills
    addSkills: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { teachingSkills, learningSkills } = req.body;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (teachingSkills) {
                user.skills.teaching.push(...teachingSkills);
            }

            if (learningSkills) {
                user.skills.learning.push(...learningSkills);
            }

            await user.save();

            res.status(200).json({
                success: true,
                user: {
                    skills: user.skills
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Adding skills failed',
                error: error.message
            });
        }
    },

    // New method to get user profile
    getProfile: async (req, res) => {
        try {
            const userId = req.user.userId;

            const user = await User.findById(userId)
                .select('-password')
                .populate('ratings.reviewedBy', 'fullName');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Fetching profile failed',
                error: error.message
            });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user._id).select('+password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Update password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            res.json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = authController;
