const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
