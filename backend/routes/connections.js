const express = require('express');
const router = express.Router();
const ConnectionRequest = require('../models/ConnectionRequest');
const { protect } = require('../middleware/auth');

// Send connection request
router.post('/', protect, async (req, res) => {
  try {
    const { recipientId } = req.body;
    
    // Check if request already exists
    const existingReq = await ConnectionRequest.findOne({
      requester: req.user._id,
      recipient: recipientId
    });

    if (existingReq) return res.status(400).json({ message: 'Connection request already sent' });

    const newReq = await ConnectionRequest.create({
      requester: req.user._id,
      recipient: recipientId
    });

    res.status(201).json(newReq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending connection requests for user
router.get('/pending', protect, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ recipient: req.user._id, status: 'pending' })
      .populate('requester', 'name avatar role');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update connection status
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const conn = await ConnectionRequest.findById(req.params.id);

    if (!conn) return res.status(404).json({ message: 'Request not found' });
    
    // Verify recipient is matching
    if(conn.recipient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    conn.status = status;
    await conn.save();
    
    res.json(conn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
