const express = require('express');
const router = express.Router();
const { registerValidation, loginValidation, validate } = require('../middleware/validationMiddleware');
const User = require('../models/userModel');

// Show register form
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Handle register form
router.post('/register', registerValidation, validate, async (req, res) => {
    console.log(req.body)
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', {
        errorMessages: [{ message: 'User already exists' }]
      });
    }

    const user = await User.create({ name, email, password });

    return res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    return res.render('auth/register', {
      errorMessages: [{ message: 'Something went wrong' }]
    });
  }
});

// Show login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Handle login form (basic)
router.post('/login', loginValidation, validate, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.render('auth/login', {
      errorMessages: [{ message: 'Invalid credentials' }]
    });
  }

  // You can set session or redirect as needed
  return res.redirect('/');
});

module.exports = router;
