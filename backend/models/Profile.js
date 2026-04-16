const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  // Common fields
  bio: { type: String },
  phone: { type: String },
  location: { type: String },
  country: { type: String, default: 'India' },
  skills: { type: [String] },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String }
  },
  profileCompleted: { type: Boolean, default: false },

  // Student-specific fields
  currentYear: { type: String, enum: ['1st Year', '2nd Year', '3rd Year', ''], default: '' },
  enrollmentNumber: { type: String },
  interests: { type: [String] },

  // Alumni-specific fields
  company: { type: String },
  role: { type: String },
  experienceYears: { type: Number, default: 0 },
  isAbroad: { type: Boolean, default: false },
  graduationYear: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
