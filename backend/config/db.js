const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let connected = false;
    if (process.env.MONGODB_URI) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        connected = true;
      } catch(err) {
        console.log('Local MongoDB not found, falling back to Memory Server...');
      }
    }
    if (!connected) {
      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      await mongoose.connect(memUri);
      console.log(`MongoDB Memory Server Connected: ${memUri}`);
      // Auto-seed demo accounts so logins always work
      await seedDemoAccounts();
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

const seedDemoAccounts = async () => {
  try {
    const User = require('../models/User');

    const accounts = [
      { name: 'Super Admin',  email: 'admin@bca.com',   password: 'admin123',   role: 'admin',   isApproved: true },
      { name: 'Demo Alumni',  email: 'alumni@bca.com',  password: 'alumni123',  role: 'alumni',  isApproved: true },
      { name: 'Demo Student', email: 'student@bca.com', password: 'student123', role: 'student', isApproved: true },
    ];

    for (const acc of accounts) {
      const exists = await User.findOne({ email: acc.email });
      if (!exists) {
        await User.create(acc);
        console.log(`✅ Seeded: ${acc.role} → ${acc.email} / ${acc.password}`);
      }
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = connectDB;
