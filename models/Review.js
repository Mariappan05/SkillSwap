const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        minlength: [10, 'Comment must be at least 10 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent multiple reviews on same session by same author
reviewSchema.index({ session: 1, author: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
