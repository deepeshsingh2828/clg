// Run with: node seed.js
// Creates a default admin account (auto-approved)

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@bca.com' });
  if (existing) {
    // Ensure admin is approved
    if (!existing.isApproved) {
      existing.isApproved = true;
      await existing.save();
      console.log('Admin updated to approved.');
    }
    console.log('Admin already exists: admin@bca.com / admin123');
    process.exit(0);
  }

  await User.create({
    name: 'Super Admin',
    email: 'admin@bca.com',
    password: 'admin123',
    role: 'admin',
    isApproved: true
  });

  console.log('✅ Admin created!');
  console.log('   Email:    admin@bca.com');
  console.log('   Password: admin123');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
