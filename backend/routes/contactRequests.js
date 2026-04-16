const express = require('express');
const router = express.Router();
const ContactRequest = require('../models/ContactRequest');
const { protect, admin } = require('../middleware/auth');

// Student sends a contact request for an alumni
router.post('/', protect, async (req, res) => {
  try {
    const { targetAlumniId } = req.body;
    // Prevent duplicate pending request
    const existing = await ContactRequest.findOne({
      requester: req.user._id,
      targetAlumni: targetAlumniId,
      status: 'pending'
    });
    if (existing) return res.status(400).json({ message: 'Request already sent and is pending.' });

    const request = await ContactRequest.create({
      requester: req.user._id,
      targetAlumni: targetAlumniId
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all contact requests (Admin only)
router.get('/all', protect, admin, async (req, res) => {
  try {
    const requests = await ContactRequest.find()
      .populate('requester', 'name email role')
      .populate('targetAlumni', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user's own requests (to check approval status & notifications)
router.get('/mine', protect, async (req, res) => {
  try {
    const requests = await ContactRequest.find({ requester: req.user._id })
      .populate('targetAlumni', 'name email')
      .sort({ updatedAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if requester already has an approved request for a specific alumni
router.get('/status/:targetAlumniId', protect, async (req, res) => {
  try {
    const request = await ContactRequest.findOne({
      requester: req.user._id,
      targetAlumni: req.params.targetAlumniId
    });
    res.json(request || { status: 'none' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Approve or Reject a request
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminMessage } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const request = await ContactRequest.findById(req.params.id)
      .populate('requester', 'name email')
      .populate('targetAlumni', 'name email');

    if (!request) return res.status(404).json({ message: 'Request not found.' });

    request.status = status;
    request.adminMessage = adminMessage || '';
    await request.save();

    // Emit real-time notification via socket.io
    const io = req.app.get('io');
    if (io && request.requester) {
      io.in(request.requester._id.toString()).emit('contact_request_update', {
        status,
        alumniName: request.targetAlumni?.name,
        adminMessage: request.adminMessage
      });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
