// routes/flightBookingRoutes.js
import express from 'express';
import { createFlightBooking, getAllFlightBookings } from './flightBookingController.js';

const router = express.Router();

// POST => Create a new flight booking
router.post('/', createFlightBooking);

// (Optional) GET => Get all flight bookings
router.get('/', getAllFlightBookings);

export default router;
