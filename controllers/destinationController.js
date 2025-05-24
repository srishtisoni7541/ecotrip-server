const asyncHandler = require('express-async-handler');
const Destination = require('../models/destinationModel');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = asyncHandler(async (req, res) => {
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
  let query = Destination.find(JSON.parse(queryStr));
  
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
    query = query.sort('name');
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  query = query.skip(startIndex).limit(limit);
  
  // Execute query
  const destinations = await query;
  
  // Pagination result
  const total = await Destination.countDocuments(JSON.parse(queryStr));
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
    count: destinations.length,
    pagination,
    data: destinations
  });
});

// @desc    Get destinations by region
// @route   GET /api/destinations/region/:region
// @access  Public
const getDestinationsByRegion = asyncHandler(async (req, res) => {
  const { region } = req.params;
  
  if (!['Indian Wildlife', 'African Wildlife'].includes(region)) {
    res.status(400);
    throw new Error('Invalid region specified. Must be "Indian Wildlife" or "African Wildlife"');
  }
  
  const destinations = await Destination.find({ region });
  
  res.status(200).json({
    success: true,
    count: destinations.length,
    data: destinations
  });
});

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
const getDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id).populate({
    path: 'tours',
    select: 'name tagline price discountedPrice startDate images'
  });
  
  if (!destination) {
    res.status(404);
    throw new Error(`Destination not found with id of ${req.params.id}`);
  }
  
  res.status(200).json({
    success: true,
    data: destination
  });
});

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.create(req.body);
  
  res.status(201).json({
    success: true,
    data: destination
  });
});

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = asyncHandler(async (req, res) => {
  let destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    res.status(404);
    throw new Error(`Destination not found with id of ${req.params.id}`);
  }
  
  destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: destination
  });
});

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    res.status(404);
    throw new Error(`Destination not found with id of ${req.params.id}`);
  }
  
  await destination.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload destination images
// @route   POST /api/destinations/:id/images
// @access  Private/Admin
const uploadDestinationImages = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    res.status(404);
    throw new Error(`Destination not found with id of ${req.params.id}`);
  }
  
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one file');
  }
  
  const imageUrls = req.files.map(file => file.path);
  
  // Update destination with new images
  destination.images.push(...imageUrls);
  await destination.save();
  
  res.status(200).json({
    success: true,
    data: destination
  });
});

module.exports = {
  getDestinations,
  getDestinationsByRegion,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  uploadDestinationImages
};