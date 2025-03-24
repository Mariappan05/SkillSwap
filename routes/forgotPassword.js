const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'skillswap55403@gmail.com',
    pass: 'fdfi twje kkcn adzi'
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      timestamp: Date.now()
    });

    const mailOptions = {
      from: '"SkillSwap" <skillswap55403@gmail.com>',
      to: email,
      subject: 'SkillSwap - Password Reset OTP',
      text: `
    Hello from SkillSwap!
    
    Your password reset OTP is: ${otp}
    
    This OTP will expire in 10 minutes.
    
    If you didn't request this password reset, please ignore this email.
    
    Best regards,
    The SkillSwap Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2c3e50;">SkillSwap Password Reset</h2>
          <p>Hello from SkillSwap!</p>
          <p>Your password reset OTP is: <strong style="font-size: 20px; color: #e74c3c;">${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <p style="color: #7f8c8d;">If you didn't request this password reset, please ignore this email.</p>
          <br>
          <p>Best regards,<br>The SkillSwap Team</p>
        </div>
      `
    };
    

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedOTPData = otpStore.get(email);

    if (!storedOTPData) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (storedOTPData.otp != otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() - storedOTPData.timestamp > 600000) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const storedOTPData = otpStore.get(email);
    if (!storedOTPData || storedOTPData.otp != otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    otpStore.delete(email);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;
