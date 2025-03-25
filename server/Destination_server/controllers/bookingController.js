const Booking = require("../models/Booking");

// Create a new booking
exports.createBooking = async (req, res) => {
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
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
  }
};
