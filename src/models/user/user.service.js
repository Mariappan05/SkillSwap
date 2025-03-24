const User = require('./user.model');
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    return await user.save();
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async updateProfile(userId, profileData) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { profile: profileData } },
      { new: true }
    );
  }
}

module.exports = new UserService();
