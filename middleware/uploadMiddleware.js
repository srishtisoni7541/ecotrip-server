const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for tour images
const tourStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecotrip/tours',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

// Configure storage for testimonial media
const testimonialStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecotrip/testimonials',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4']
  }
});

// Configure storage for destination images
const destinationStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecotrip/destinations',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

// Create multer upload instances
const uploadTourImages = multer({ 
  storage: tourStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadTestimonialMedia = multer({ 
  storage: testimonialStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const uploadDestinationImages = multer({ 
  storage: destinationStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = {
  uploadTourImages,
  uploadTestimonialMedia,
  uploadDestinationImages
};