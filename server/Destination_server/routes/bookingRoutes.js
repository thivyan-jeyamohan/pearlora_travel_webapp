const express = require("express");
const { createBooking, getBookingById, getBookings, getBookingReport, getDistinctDestinations } = require("../controllers/bookingController");

const router = express.Router();

// Route to create booking
router.post("/", createBooking);

// Route to fetch all bookings
router.get("/", getBookings);

// Route to fetch booking by ID
router.get("/:id", getBookingById);

// Route to generate the booking report
router.get("/report", getBookingReport);

// Route to fetch distinct destinations
router.get("/destinations", getDistinctDestinations);

module.exports = router;  // Export the router to use in server.js
