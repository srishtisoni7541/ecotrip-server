const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const { sendEmail } = require('../utils/emailService');

// @desc    Get bookings for current user
// @route   GET /api/bookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: 'tour',
      select: 'name startDate endDate price images'
    });
  
  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'tour',
      select: 'name startDate endDate price images itinerary'
    });
  
  if (!booking) {
    res.status(404);
    throw new Error(`Booking not found with id of ${req.params.id}`);
  }
  
  // Make sure user is booking owner or an admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to access this booking');
  }
  
  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.user = req.user.id;
  console.log(req.body);
  
  // Check if tour exists
  const tour = await Tour.findById(req.body.tourId);
  
  if (!tour) {
    res.status(404);
    throw new Error(`Tour not found with id of ${req.body.tour}`);
  }
  
  // Calculate price (use discounted price if available)
  const price = tour.discountedPrice || tour.price;
  req.body.price = price;
  
  // Create booking
  const booking = await Booking.create(req.body);
  
  // Send confirmation email
  const message = `
    Thank you for booking the ${tour.name} tour!
    
    Booking Details:
    - Tour: ${tour.name}
    - Date: ${new Date(tour.startDate).toLocaleDateString()} to ${new Date(tour.endDate).toLocaleDateString()}
    - Number of Persons: ${booking.numberOfPersons}
    - Total Amount: $${booking.totalAmount}
    - Booking Status: ${booking.status}
    
    Please contact us if you have any questions.
    
    The EcoTriip Team
  `;
  
  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Your EcoTriip Safari Booking Confirmation',
      message
    });
  } catch (err) {
    console.log('Email could not be sent', err);
  }
  
  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBooking = asyncHandler(async (req, res) => {
  let booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error(`Booking not found with id of ${req.params.id}`);
  }
  
  // Only admin can update bookings
  if (req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this booking');
  }
  
  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  let booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error(`Booking not found with id of ${req.params.id}`);
  }
  
  // Make sure user is booking owner or an admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to cancel this booking');
  }
  
  // Check if booking is already cancelled
  if (booking.status === 'cancelled') {
    res.status(400);
    throw new Error('This booking is already cancelled');
  }
  
  booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    {
      new: true,
      runValidators: true
    }
  );
  
  // Send cancellation email
  const tour = await Tour.findById(booking.tour);
  const message = `
    Your booking for ${tour.name} has been cancelled.
    
    Booking Details:
    - Tour: ${tour.name}
    - Date: ${new Date(tour.startDate).toLocaleDateString()} to ${new Date(tour.endDate).toLocaleDateString()}
    - Number of Persons: ${booking.numberOfPersons}
    - Total Amount: $${booking.totalAmount}
    
    If you have any questions about your cancellation, please contact us.
    
    The EcoTriip Team
  `;
  
  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Your EcoTriip Safari Booking Cancellation',
      message
    });
  } catch (err) {
    console.log('Email could not be sent', err);
  }
  
  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const status = req.query.status;
  
  let query = {};
  if (status) {
    query.status = status;
  }
  
  const bookings = await Booking.find(query)
    .populate({
      path: 'tour',
      select: 'name startDate endDate'
    })
    .populate({
      path: 'user',
      select: 'name email'
    })
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');
  
  const total = await Booking.countDocuments(query);
  const pagination = {};
  
  if (startIndex + limit < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: bookings.length,
    pagination,
    data: bookings
  });
});

module.exports = {
  getMyBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  getAllBookings
};