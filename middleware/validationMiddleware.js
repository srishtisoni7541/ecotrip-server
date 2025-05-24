const { body, validationResult } = require('express-validator');

// Validation result middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// User login validation
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required')
];

// Tour validation
const tourValidation = [
  body('name').notEmpty().withMessage('Tour name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('discountedPrice')
    .optional()
    .isNumeric()
    .withMessage('Discounted price must be a number'),
  body('startDate').isDate().withMessage('Start date must be a valid date'),
  body('endDate').isDate().withMessage('End date must be a valid date'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('description').notEmpty().withMessage('Description is required')
];

// Booking validation
const bookingValidation = [
  body('tourId').notEmpty().withMessage('Tour ID is required'),
  body('numberOfPersons')
    .isInt({ min: 1 })
    .withMessage('Number of persons must be at least 1')
];

// Contact form validation
const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('message').notEmpty().withMessage('Message is required')
];

// Testimonial validation
const testimonialValidation = [
  body('content').notEmpty().withMessage('Testimonial content is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  tourValidation,
  bookingValidation,
  contactValidation,
  testimonialValidation
};