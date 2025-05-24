const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/users/profile
// @desc Get user profile
// @access Private
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// @route PUT /api/users/profile
// @desc Update user profile
// @access Private
router.put('/profile', protect, (req, res) => {
  // This is a placeholder - in a real app, you would implement user profile update logic here
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: req.user
  });
});

module.exports = router;