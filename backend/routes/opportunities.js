const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const { protect, alumniOnly } = require('../middleware/auth');

// Get all opportunities
router.get('/', protect, async (req, res) => {
  try {
    const opps = await Opportunity.find()
      .populate('postedBy', 'name avatar role')
      .sort({ createdAt: -1 });
    res.json(opps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create an opportunity (Alumni only)
router.post('/', protect, alumniOnly, async (req, res) => {
  try {
    const { title, description, type, company, location, applyLink } = req.body;
    
    const opp = new Opportunity({
      title, description, type, company, location, applyLink,
      postedBy: req.user._id
    });
    
    const createdOpp = await opp.save();
    res.status(201).json(createdOpp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
