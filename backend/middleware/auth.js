const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.log(`Auth failed: User ${decoded.id} not found in DB`);
        return res.status(401).json({ message: 'User no longer exists' });
      }
      next();
    } catch (error) {
      console.log('Auth failed: Token verification error', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('Auth failed: No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const alumniOnly = (req, res, next) => {
  if (req.user && req.user.role === 'alumni') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an alumni' });
  }
};

module.exports = { protect, admin, alumniOnly };
