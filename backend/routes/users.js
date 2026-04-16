const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const ContactRequest = require('../models/ContactRequest');
const { protect, admin } = require('../middleware/auth');

// Check if current user's profile is completed
router.get('/profile/check/status', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile || !profile.profileCompleted) {
      return res.json({ completed: false });
    }
    res.json({ completed: true, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all alumni profiles (directory)
router.get('/alumni', protect, async (req, res) => {
  try {
    const profiles = await Profile.find({ profileCompleted: true }).populate({
      path: 'user',
      match: { role: 'alumni' },
      select: 'name email avatar role'
    });
    const validProfiles = profiles.filter(p => p.user !== null);

    const approvedRequests = await ContactRequest.find({
      requester: req.user._id,
      status: 'approved'
    }).select('targetAlumni');

    const approvedSet = new Set(approvedRequests.map(r => r.targetAlumni.toString()));

    const result = validProfiles.map(profile => {
      const isApproved = approvedSet.has(profile.user._id.toString());
      return {
        _id: profile._id,
        graduationYear: profile.graduationYear,
        bio: profile.bio,
        company: profile.company,
        role: profile.role,
        skills: profile.skills,
        isAbroad: profile.isAbroad,
        experienceYears: profile.experienceYears,
        user: {
          _id: profile.user._id,
          name: profile.user.name,
          avatar: profile.user.avatar,
          role: profile.user.role,
        },
        location: isApproved ? profile.location : null,
        country: isApproved ? profile.country : null,
        socialLinks: isApproved ? profile.socialLinks : null,
        email: isApproved ? profile.user.email : null,
        phone: isApproved ? profile.phone : null,
        contactVisible: isApproved
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update current user profile
router.post('/profile', protect, async (req, res) => {
  try {
    const {
      bio, phone, company, role, experienceYears, location, country,
      isAbroad, skills, socialLinks, graduationYear,
      currentYear, enrollmentNumber, interests
    } = req.body;

    const profileFields = {
      user: req.user._id,
      bio, phone, location, country, skills, socialLinks,
      company, role, experienceYears, isAbroad, graduationYear,
      currentYear, enrollmentNumber, interests,
      profileCompleted: true
    };

    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile by User ID
router.get('/profile/:userId', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'name avatar role');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all users list
router.get('/all', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get ALL profiles with FULL details (no privacy masking)
router.get('/admin/profiles', protect, admin, async (req, res) => {
  try {
    const profiles = await Profile.find({ profileCompleted: true })
      .populate('user', 'name email avatar role isApproved')
      .sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Dashboard stats
router.get('/admin/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalProfiles = await Profile.countDocuments({ profileCompleted: true });
    const pendingRequests = await ContactRequest.countDocuments({ status: 'pending' });
    const approvedRequests = await ContactRequest.countDocuments({ status: 'approved' });
    const rejectedRequests = await ContactRequest.countDocuments({ status: 'rejected' });
    const pendingApprovals = await User.countDocuments({ isApproved: false, role: { $ne: 'admin' } });
    res.json({ totalUsers, totalStudents, totalAlumni, totalProfiles, pendingRequests, approvedRequests, rejectedRequests, pendingApprovals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Approve or Reject user account
router.put('/approve/:id', protect, admin, async (req, res) => {
  try {
    const { approved } = req.body; // true = approve, false = reject
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (approved) {
      user.isApproved = true;
      await user.save();

      // Emit socket notification to the user
      const io = req.app.get('io');
      if (io) {
        io.in(user._id.toString()).emit('account_approved', {
          message: `Your ${user.role} account has been approved! You can now login.`
        });
      }

      res.json({ message: `${user.name}'s account approved successfully.` });
    } else {
      // Reject = delete user
      await User.findByIdAndDelete(req.params.id);
      await Profile.findOneAndDelete({ user: req.params.id });
      res.json({ message: `${user.name}'s account has been rejected and removed.` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete a user
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Profile.findOneAndDelete({ user: req.params.id });
    res.json({ message: 'User and profile deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
