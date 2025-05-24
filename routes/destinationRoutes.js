const express = require('express');
const {
  getDestinations,
  getDestinationsByRegion,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  uploadDestinationImages
} = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadDestinationImages: upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/region/:region').get(getDestinationsByRegion);

router
  .route('/')
  .get(getDestinations)
  .post(protect, admin, createDestination);

router
  .route('/:id')
  .get(getDestination)
  .put(protect, admin, updateDestination)
  .delete(protect, admin, deleteDestination);

router
  .route('/:id/images')
  .post(protect, admin, upload.array('images', 5), uploadDestinationImages);

module.exports = router;