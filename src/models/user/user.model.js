const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['LEARNER', 'MENTOR', 'BOTH'],
    default: 'LEARNER'
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    skills: {
      canTeach: [String],
      wantToLearn: [String]
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
