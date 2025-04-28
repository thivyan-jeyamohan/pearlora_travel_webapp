const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController'); // Make sure the path is correct

// Weather API route
router.post('/', getWeather);

module.exports = router;  // Export the router
