const express = require('express');
const {
  sendContactEmail,
  getAboutContent,
  getContactInfo
} = require('../controllers/contactController');
const { contactValidation, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/', contactValidation, validate, sendContactEmail);
router.get('/about', getAboutContent);
router.get('/info', getContactInfo);

module.exports = router;