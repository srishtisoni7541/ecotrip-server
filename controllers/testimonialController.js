const asyncHandler = require('express-async-handler');
const Testimonial = require('../models/testimonialModel');

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  // Build query
  const reqQuery = { ...req.query, approved: true };
  
  // Fields to exclude from query
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);
  
  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  
  // Finding resource
  let query = Testimonial.find(JSON.parse(queryStr))
    .populate({
      path: 'user',
      select: 'name'
    })
    .populate({
      path: 'tour',
      select: 'name'
    });
  
  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  query = query.skip(startIndex).limit(limit);
  
  // Execute query
  const testimonials = await query;
  
  // Pagination result
  const total = await Testimonial.countDocuments({ ...JSON.parse(queryStr), approved: true });
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
    count: testimonials.length,
    pagination,
    data: testimonials
  });
});

// @desc    Get featured testimonials
// @route   GET /api/testimonials/featured
// @access  Public
const getFeaturedTestimonials = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  
  const testimonials = await Testimonial.find({ approved: true, featured: true })
    .populate({
      path: 'user',
      select: 'name'
    })
    .populate({
      path: 'tour',
      select: 'name'
    })
    .limit(limit)
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials
  });
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name'
    })
    .populate({
      path: 'tour',
      select: 'name'
    });
  
  if (!testimonial) {
    res.status(404);
    throw new Error(`Testimonial not found with id of ${req.params.id}`);
  }
  
  // Only allow admin to see unapproved testimonials
  if (!testimonial.approved && (!req.user || req.user.role !== 'admin')) {
    res.status(404);
    throw new Error(`Testimonial not found with id of ${req.params.id}`);
  }
  
  res.status(200).json({
    success: true,
    data: testimonial
  });
});

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.user = req.user.id;
  
  // Check if the user has already submitted a testimonial for this tour
  const existingTestimonial = await Testimonial.findOne({
    tour: req.body.tour,
    user: req.user.id
  });
  
  if (existingTestimonial) {
    res.status(400);
    throw new Error('You have already submitted a testimonial for this tour');
  }
  
  const testimonial = await Testimonial.create(req.body);
  
  res.status(201).json({
    success: true,
    data: testimonial
  });
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
const updateTestimonial = asyncHandler(async (req, res) => {
  let testimonial = await Testimonial.findById(req.params.id);
  
  if (!testimonial) {
    res.status(404);
    throw new Error(`Testimonial not found with id of ${req.params.id}`);
  }
  
  // Make sure user is the testimonial owner or an admin
  if (testimonial.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this testimonial');
  }
  
  // User can only update content, rating, title, mediaUrl, and mediaType
  if (req.user.role !== 'admin') {
    const allowedUpdates = ['content', 'rating', 'title', 'mediaUrl', 'mediaType'];
    Object.keys(req.body).forEach(key => {
      if (!allowedUpdates.includes(key)) {
        delete req.body[key];
      }
    });
  }
  
  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: testimonial
  });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  
  if (!testimonial) {
    res.status(404);
    throw new Error(`Testimonial not found with id of ${req.params.id}`);
  }
  
  // Make sure user is the testimonial owner or an admin
  if (testimonial.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this testimonial');
  }
  
  await testimonial.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Approve/reject testimonial (admin only)
// @route   PUT /api/testimonials/:id/approve
// @access  Private/Admin
const approveTestimonial = asyncHandler(async (req, res) => {
  const { approved, featured } = req.body;
  
  if (typeof approved === 'undefined') {
    res.status(400);
    throw new Error('Please provide approval status');
  }
  
  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { 
      approved, 
      featured: featured || false 
    },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!testimonial) {
    res.status(404);
    throw new Error(`Testimonial not found with id of ${req.params.id}`);
  }
  
  res.status(200).json({
    success: true,
    data: testimonial
  });
});

module.exports = {
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial
};