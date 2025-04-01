const Booking = require("../models/Booking");  // Import the Booking model

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { name, email, date, people, destination, price } = req.body;
    const newBooking = new Booking({ name, email, date, people, destination, price });
    await newBooking.save();
    res.status(201).json({ success: true, message: "Booking saved successfully!", data: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving booking", error: error.message });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching booking by ID", error: error.message });
  }
};

// Generate booking report (Example function)
const getBookingReport = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const totalBookings = bookings.length;
    res.status(200).json({ success: true, totalBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating report", error: error.message });
  }
};

// Fetch distinct destinations
const getDistinctDestinations = async (req, res) => {
  try {
    const destinations = await Booking.distinct('destination');  // Example query for distinct destinations
    res.status(200).json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching destinations", error: error.message });
  }
};

// Export controller functions
module.exports = { createBooking, getBookingById, getBookings, getBookingReport, getDistinctDestinations };
