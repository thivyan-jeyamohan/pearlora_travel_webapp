// controllers/flightBookingController.js
import FlightBooking from './FlightBooking.js';

export const createFlightBooking = async (req, res) => {
  try {
    const newBooking = new FlightBooking(req.body);
    await newBooking.save();
    res.status(201).json({ success: true, message: 'Flight booking created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET - Get all flight bookings
export const getAllFlightBookings = async (req, res) => {
  try {
    const bookings = await FlightBooking.find().sort({ createdAt: -1 }); // Sort latest first
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
