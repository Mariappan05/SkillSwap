const User = require('../user/user.model');

class SkillMatchService {
  async findMatchingUsers(skills) {
    return await User.find({
      'profile.skills.canTeach': { $in: skills }
    });
  }

  async createSkillSwapRequest(fromUserId, toUserId, skill) {
    const request = new SkillSwapRequest({
      from: fromUserId,
      to: toUserId,
      skill,
      status: 'PENDING'
    });
    return await request.save();
  }
}

module.exports = new SkillMatchService();
