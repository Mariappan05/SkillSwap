const User = require('../models/User');
const Skill = require('../models/Skill');
const bcrypt = require('bcryptjs');

const profileController = {
    updateProfile: async (req, res) => {
        try {
            // Find user and include password for verification
            const user = await User.findById(req.user._id).select('+password');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Debug logging
            console.log('Updating profile for user:', user._id);

            // Password update logic
            if (req.body.currentPassword && req.body.newPassword) {
                const isMatch = await bcrypt.compare(
                    req.body.currentPassword,
                    user.password
                );

                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: 'Current password is incorrect'
                    });
                }

                // Hash new password
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.newPassword, salt);
            }

            // Prepare update object
            const updateObj = {};

            // Update professor details
            if (req.body.professorDetails) {
                updateObj.professorDetails = {
                    experience: req.body.professorDetails.experience,
                    currentRole: req.body.professorDetails.currentRole,
                    institutionName: req.body.professorDetails.institutionName,
                    institutionLocation: req.body.professorDetails.institutionLocation,
                    idProof: req.body.professorDetails.idProof
                };
            }

            // Update skills array
            if (req.body.skills && Array.isArray(req.body.skills)) {
                updateObj.skills = req.body.skills.map(skill => ({
                    name: skill.name,
                    proficiency: skill.proficiency,
                    yearsOfExperience: skill.yearsOfExperience
                }));
            }

            // Update basic profile information
            if (req.body.role) updateObj.role = req.body.role;
            if (req.body.age) updateObj.age = req.body.age;
            
            // Update contact information
            if (req.body.contact) {
                updateObj.contact = {
                    phone: req.body.contact.phone,
                    alternateEmail: req.body.contact.alternateEmail
                };
            }

            // Update address
            if (req.body.address) {
                updateObj.address = {
                    street: req.body.address.street,
                    city: req.body.address.city,
                    state: req.body.address.state,
                    zipCode: req.body.address.zipCode,
                    country: req.body.address.country
                };
            }

            updateObj.profileCompleted = true;

            // Use findOneAndUpdate instead of save
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { $set: updateObj },
                { new: true, runValidators: false }
            ).select('-password');

            res.json({
                success: true,
                data: updatedUser,
                message: 'Profile updated successfully'
            });

        } catch (error) {
            console.error('Profile update error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id)
                .select('-password')
                .populate('skills');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateSkills: async (req, res) => {
        try {
            const user = await User.findById(req.user?._id);
            const { skills } = req.body;

            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    success: false,
                    message: 'Skills must be an array'
                });
            }

            // Handle skills based on user role
            if (user.role === 'student') {
                // For students, only skill names are required
                user.skills = skills.map(skill => ({
                    name: typeof skill === 'string' ? skill : skill.name
                }));
            } else if (user.role === 'professor') {
                // For professors, validate complete skill details
                if (!skills.every(skill => skill.name && skill.proficiency && skill.yearsOfExperience)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Professor skills must include name, proficiency, and years of experience'
                    });
                }
                user.skills = skills;
            }

            await user.save();

            res.json({
                success: true,
                data: {
                    skills: user.skills,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Skills update error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = profileController;