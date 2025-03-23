// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    fullName: {
        type: String,
        required: true
    },
    profile: {
        skills: {
            canTeach: [String],
            wantToLearn: [String]
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model only if it hasn't been compiled yet
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
