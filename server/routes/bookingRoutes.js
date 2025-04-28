import express from "express";
import { createBooking, getBookingById, getBookings, getBookingReport, getDistinctDestinations } from "../controllers/bookingController.js";

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

export default router;  // Export the router to use in server.js
