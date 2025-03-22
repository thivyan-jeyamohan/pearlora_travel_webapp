import express from "express";
import { createBooking, getAllBookings, cancelBooking } from "../controllers/bookingController";

const router = express.Router();

// Create a new booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getAllBookings);

// Cancel a booking
router.delete("/:id", cancelBooking);

module.exports = router;
