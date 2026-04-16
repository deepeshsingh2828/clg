const mongoose = require('mongoose');

const ContactRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetAlumni: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminMessage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ContactRequest', ContactRequestSchema);
