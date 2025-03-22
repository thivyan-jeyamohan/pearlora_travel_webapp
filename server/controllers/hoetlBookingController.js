import Booking from "../models/Booking";
import Room from "../models/Room";

//Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, hotelId, roomId, checkInDate, checkOutDate, totalAmount } = req.body;

    // Check room availability
    const room = await Room.findById(roomId);
    if (!room || !room.availability) {
      return res.status(400).json({ error: "Room not available" });
    }

    // Create booking
    const newBooking = new Booking({ userId, hotelId, roomId, checkInDate, checkOutDate, totalAmount, status: "pending" });
    await newBooking.save();

    // Mark room as unavailable
    await Room.findByIdAndUpdate(roomId, { availability: false });

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId").populate("hotelId").populate("roomId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Mark room as available
    await Room.findByIdAndUpdate(booking.roomId, { availability: true });

    // Delete booking
    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
