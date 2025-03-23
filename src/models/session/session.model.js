const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skill: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED'
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
