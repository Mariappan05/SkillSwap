const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Session title is required']
    },
    description: {
        type: String,
        required: [true, 'Session description is required']
    },
    date: {
        type: Date,
        required: [true, 'Session date is required']
    },
    duration: {
        type: Number,
        required: [true, 'Session duration is required']
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', sessionSchema);
