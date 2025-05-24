const express = require('express');
const {
  getMyBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const { bookingValidation, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, getMyBookings)
  .post(protect, bookingValidation, validate, createBooking);

router
  .route('/:id')
  .get(protect, getBooking)
  .put(protect, admin, updateBooking);

router
  .route('/:id/cancel')
  .put(protect, cancelBooking);

router
  .route('/admin/all')
  .get(protect, admin, getAllBookings);

module.exports = router;