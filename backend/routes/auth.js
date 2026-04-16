const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Register User (student/alumni — needs admin approval)
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: (role === 'admin') ? 'student' : (role || 'student'),
      isApproved: true
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user._id),
        message: 'Registration successful!'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User ${email} not found`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Login failed: Incorrect password for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`Login successful: ${email} (${user.role})`);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(`Login error for ${email}:`, error.message);
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password — instantly change password
router.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Instantly reset password
    user.password = newPassword;
    user.resetRequested = false;
    user.resetRequestedAt = null;
    await user.save();

    res.json({ message: 'Password has been successfully reset. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = router;
