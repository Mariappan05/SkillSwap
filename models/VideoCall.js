const mongoose = require('mongoose');

const videoCallSchema = new mongoose.Schema({
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    status: {
        type: String,
        enum: ['initiated', 'ongoing', 'ended'],
        default: 'initiated'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date
    }
});

module.exports = mongoose.model('VideoCall', videoCallSchema);
