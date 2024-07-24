const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../controllers/contactController');

// Route handler for handling contact form submissions
router.post('/', sendContactMessage);

module.exports = router;