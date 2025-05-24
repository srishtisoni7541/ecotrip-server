const express = require('express');
const {
  getTours,
  getFeaturedTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  uploadTourImages
} = require('../controllers/tourController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadTourImages: upload } = require('../middleware/uploadMiddleware');
const { tourValidation, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/featured').get(getFeaturedTours);

router
  .route('/')
  .get(getTours)
  .post(protect, admin, tourValidation, validate, createTour);

router
  .route('/:id')
  .get(getTour)
  .put(protect, admin, tourValidation, validate, updateTour)
  .delete(protect, admin, deleteTour);

router
  .route('/:id/images')
  .post(protect, admin, upload.array('images', 5), uploadTourImages);

module.exports = router;