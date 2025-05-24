const express = require('express');
const {
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial
} = require('../controllers/testimonialController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadTestimonialMedia: upload } = require('../middleware/uploadMiddleware');
const { testimonialValidation, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/featured').get(getFeaturedTestimonials);

router
  .route('/')
  .get(getTestimonials)
  .post(protect, testimonialValidation, validate, createTestimonial);

router
  .route('/:id')
  .get(getTestimonial)
  .put(protect, testimonialValidation, validate, updateTestimonial)
  .delete(protect, deleteTestimonial);

router
  .route('/:id/approve')
  .put(protect, admin, approveTestimonial);

router
  .route('/:id/media')
  .post(protect, upload.single('media'), (req, res) => {
    res.json({
      success: true,
      mediaUrl: req.file.path,
      mediaType: req.file.mimetype.startsWith('image/') ? 'image' : 'video'
    });
  });

module.exports = router;