const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log("Token from header:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      return next(); // ⬅️ Stop execution here if success
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // ⬇️ This will only run if header was missing or malformed
  res.status(401);
  throw new Error('Not authorized, no token');
});

// Admin middleware
const admin = (req, res, next) => {
  console.log(req.body);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };