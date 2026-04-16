const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// Fetch history between logged in user and another user
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message via API (Alternative to pure sockets, or for persistence before emit)
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    if(!content || !receiverId) {
      return res.status(400).json({ message: 'Invalid data passed into request' });
    }

    var newMessage = {
      sender: req.user._id,
      receiver: receiverId,
      content: content
    };

    var message = await Message.create(newMessage);
    
    // Populate simple fields
    message = await message.populate('sender', 'name avatar');
    message = await message.populate('receiver', 'name avatar');
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
