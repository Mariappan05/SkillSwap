const express = require('express');
const router = express.Router();
const multer = require('multer');
const Profile = require('../models/Profile');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get profile details
router.get('/api/profile/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new profile
router.post('/api/profile', upload.single('idProof'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      email,
      education,
      about,
      skills,
      role,
      userId
    } = req.body;

    const profileData = {
      firstName,
      lastName,
      mobileNumber,
      email,
      education: JSON.parse(education),
      about,
      skills: JSON.parse(skills),
      role,
      userId
    };

    if (role === 'professor' && req.file) {
      profileData.idProof = req.file.path;
    }

    const newProfile = new Profile(profileData);
    await newProfile.save();

    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/api/profile/:userId', upload.single('idProof'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      email,
      education,
      about,
      skills,
      role
    } = req.body;

    const updateData = {
      firstName,
      lastName,
      mobileNumber,
      email,
      education: JSON.parse(education),
      about,
      skills: JSON.parse(skills),
      role
    };

    if (role === 'professor' && req.file) {
      updateData.idProof = req.file.path;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      updateData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete profile
router.delete('/api/profile/:userId', async (req, res) => {
  try {
    const deletedProfile = await Profile.findOneAndDelete({ userId: req.params.userId });
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
