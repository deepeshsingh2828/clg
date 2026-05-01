const express = require('express');
const router = express.Router();
const ContactRequest = require('../models/ContactRequest');
const { protect, admin } = require('../middleware/auth');

// Student sends a contact request for an alumni
router.post('/', protect, async (req, res) => {
  try {
    const { targetAlumniId } = req.body;
    // Prevent duplicate pending requests
    const existing = await ContactRequest.findOne({
      requester: req.user._id,
      targetAlumni: targetAlumniId,
      status: { $in: ['pending_alumni', 'pending_admin', 'approved'] }
    });
    if (existing) return res.status(400).json({ message: 'Request already sent or approved.' });

    const request = await ContactRequest.create({
      requester: req.user._id,
      targetAlumni: targetAlumniId,
      status: 'pending_alumni'
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all contact requests
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

// Alumni: Get requests targeted at them
router.get('/alumni', protect, async (req, res) => {
  try {
    const requests = await ContactRequest.find({ targetAlumni: req.user._id })
      .populate('requester', 'name email role')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student: Get current user's own sent requests
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
    }).sort({ createdAt: -1 });
    res.json(request || { status: 'none' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Alumni: Approve or Reject a request
router.put('/alumni/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending_admin', 'rejected_by_alumni'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update by alumni.' });
    }
    const request = await ContactRequest.findById(req.params.id)
      .populate('requester', 'name email')
      .populate('targetAlumni', 'name email');

    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.targetAlumni._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request.' });
    }
    if (request.status !== 'pending_alumni') {
      return res.status(400).json({ message: 'Request is not pending alumni approval.' });
    }

    request.status = status;
    await request.save();

    const io = req.app.get('io');
    if (io && request.requester) {
      io.in(request.requester._id.toString()).emit('contact_request_update', {
        status: request.status,
        alumniName: request.targetAlumni.name,
        message: status === 'pending_admin' ? 'Alumni approved, waiting for admin approval.' : 'Alumni rejected your request.'
      });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Approve or Reject a request (Final step)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminMessage } = req.body;
    if (!['approved', 'rejected_by_admin'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update by admin.' });
    }
    const request = await ContactRequest.findById(req.params.id)
      .populate('requester', 'name email')
      .populate('targetAlumni', 'name email');

    if (!request) return res.status(404).json({ message: 'Request not found.' });

    // Ensure it was already approved by alumni
    if (request.status !== 'pending_admin' && status === 'approved') {
      return res.status(400).json({ message: 'Request must be approved by alumni first.' });
    }

    request.status = status;
    request.adminMessage = adminMessage || '';
    await request.save();

    const io = req.app.get('io');
    if (io && request.requester) {
      io.in(request.requester._id.toString()).emit('contact_request_update', {
        status: request.status,
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
