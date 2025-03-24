const User = require('../src/models/user.model');

class UserService {
  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserProfile(userId, profileData) {
    const updateFields = {
      'profile.firstName': profileData.firstName,
      'profile.lastName': profileData.lastName,
      'profile.bio': profileData.bio,
      'profile.contactInfo': {
        phone: profileData.phone,
        linkedin: profileData.linkedin
      }
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: updateFields }, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async updateUserSkills(userId, canTeach, wantToLearn) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'profile.skills.canTeach': canTeach,
          'profile.skills.wantToLearn': wantToLearn
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async findMatchingUsers(skills) {
    // Find users who can teach skills that the current user wants to learn
    const matchingUsers = await User.find({
      'profile.skills.canTeach': { $in: skills }
    }).select('-password');

    return matchingUsers;
  }
}

module.exports = new UserService();
