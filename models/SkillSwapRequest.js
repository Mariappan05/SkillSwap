const mongoose = require('mongoose');

const SkillSwapRequestSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    senderSkill: { 
        type: String, 
        required: true 
    },
    receiverSkill: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('SkillSwapRequest', SkillSwapRequestSchema);
