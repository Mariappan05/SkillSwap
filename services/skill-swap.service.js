const SkillSwapRequest = require('../src/models/skill-swap-request.model');
const Notification = require('../src/models/notification.model');

class SkillSwapService {
  async createSkillSwapRequest(fromUserId, toUserId, skill) {
    // Check if a similar request already exists
    const existingRequest = await SkillSwapRequest.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
      skill: skill,
      status: 'PENDING'
    });

    if (existingRequest) {
      throw new Error('Skill swap request already exists');
    }

    // Create new skill swap request
    const skillSwapRequest = new SkillSwapRequest({
      fromUser: fromUserId,
      toUser: toUserId,
      skill: skill,
      status: 'PENDING'
    });

    await skillSwapRequest.save();

    // Create notification for the recipient
    await Notification.create({
      recipient: toUserId,
      type: 'SKILL_SWAP_REQUEST',
      content: `New skill swap request for ${skill}`,
      isRead: false
    });

    return skillSwapRequest;
  }

  async getSkillSwapRequests(userId) {
    // Get requests where user is either sender or recipient
    return SkillSwapRequest.find({
      $or: [
        { fromUser: userId },
        { toUser: userId }
      ]
    }).populate('fromUser toUser', 'username email');
  }

  async updateSkillSwapRequest(requestId, userId, status) {
    const request = await SkillSwapRequest.findById(requestId);

    if (!request) {
      throw new Error('Skill swap request not found');
    }

    // Ensure only the recipient can update the request
    if (request.toUser.toString() !== userId) {
      throw new Error('Unauthorized to update this request');
    }

    request.status = status;
    await request.save();

    // Create notification based on status
    await Notification.create({
      recipient: request.fromUser,
      type: 'SKILL_SWAP_REQUEST',
      content: `Your skill swap request for ${request.skill} was ${status}`,
      isRead: false
    });

    return request;
  }
}

module.exports = new SkillSwapService();
