const express = require("express");
const { createBooking, getBookings } = require("../controllers/bookingController");

const router = express.Router();
router.post("/", createBooking);  // POST /api/bookings
router.get("/", getBookings);     // Get all bookings

module.exports = router;
