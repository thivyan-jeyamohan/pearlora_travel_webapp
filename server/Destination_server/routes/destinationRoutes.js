// routes/destinationRoutes.js
const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/destinationController");

// Route to get a destination with weather details
router.get("/destination/:id", destinationController.getDestinationWithWeather);  // Fetch destination with weather data

module.exports = router;
