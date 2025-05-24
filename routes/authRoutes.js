const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getMe 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { 
  registerValidation, 
  loginValidation, 
  validate 
} = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', registerValidation, validate, registerUser);
router.get('/me', protect, getMe);

router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', loginValidation, validate, loginUser);

router.get('/register', (req, res) => {
  res.render('auth/register');
});

module.exports = router;