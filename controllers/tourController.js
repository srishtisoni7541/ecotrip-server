const asyncHandler = require('express-async-handler');
const Tour = require('../models/tourModel');

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
const getTours = asyncHandler(async (req, res) => {
  // Build query
  const reqQuery = { ...req.query };
  
  // Fields to exclude from query
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);
  
  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  
  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  // Finding resource
  let query = Tour.find(JSON.parse(queryStr)).populate('destination');
  
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
  const tours = await query;
  
  // Pagination result
  const total = await Tour.countDocuments(JSON.parse(queryStr));
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
    count: tours.length,
    pagination,
    data: tours
  });
});

// @desc    Get featured tours
// @route   GET /api/tours/featured
// @access  Public
const getFeaturedTours = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  
  const tours = await Tour.find({ featured: true })
    .select('name tagline price discountedPrice images startDate')
    .limit(limit)
    .sort('startDate');
  
  res.status(200).json({
    success: true,
    count: tours.length,
    data: tours
  });
});

// @desc    Get single tour
// @route   GET /api/tours/:id
// @access  Public
const getTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id)
    .populate('destination')
    .populate({
      path: 'reviews',
      select: 'rating content user',
      populate: {
        path: 'user',
        select: 'name'
      }
    });
  
  if (!tour) {
    res.status(404);
    throw new Error(`Tour not found with id of ${req.params.id}`);
  }
  
  res.status(200).json({
    success: true,
    data: tour
  });
});

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private/Admin
const createTour = asyncHandler(async (req, res) => {
  console.log(req.body);
  const tour = await Tour.create(req.body);
  
  res.status(201).json({
    success: true,
    data: tour
  });
});

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private/Admin
const updateTour = asyncHandler(async (req, res) => {
  let tour = await Tour.findById(req.params.id);
  
  if (!tour) {
    res.status(404);
    throw new Error(`Tour not found with id of ${req.params.id}`);
  }
  
  tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: tour
  });
});

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private/Admin
const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  
  if (!tour) {
    res.status(404);
    throw new Error(`Tour not found with id of ${req.params.id}`);
  }
  
  await tour.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload tour images
// @route   POST /api/tours/:id/images
// @access  Private/Admin
const uploadTourImages = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  
  if (!tour) {
    res.status(404);
    throw new Error(`Tour not found with id of ${req.params.id}`);
  }
  
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one file');
  }
  
  const imageUrls = req.files.map(file => file.path);
  
  // Update tour with new images
  tour.images.push(...imageUrls);
  await tour.save();
  
  res.status(200).json({
    success: true,
    data: tour
  });
});

module.exports = {
  getTours,
  getFeaturedTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  uploadTourImages
};