const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Job', 'Internship'], required: true },
  company: { type: String },
  location: { type: String },
  applyLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
