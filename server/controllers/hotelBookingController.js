import Booking from "../models/HotelBooking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";


export const bookRoom = async (req, res) => {
    try {
        const { userId, roomIds, checkInDate, checkOutDate, totalPrice } = req.body;

        // Validate input
        if (!userId || !roomIds || !checkInDate || !checkOutDate || !Array.isArray(roomIds) || roomIds.length === 0) {
            return res.status(400).json({ message: "All fields are required, and roomIds must be a non-empty array" });
        }

        // Convert dates to Date objects for accurate comparison
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if all rooms exist
        const rooms = await Room.find({ _id: { $in: roomIds } });
        if (rooms.length !== roomIds.length) {
            return res.status(404).json({ message: "One or more rooms not found" });
        }

        // Check if any of the selected rooms are already booked
        const existingBookings = await Booking.find({
            roomId: { $in: roomIds },
            $or: [
                { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
            ]
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: "One or more rooms are already booked for these dates" });
        }

        // Create bookings for each room
        const newBookings = await Booking.create(
            roomIds.map(roomId => ({
                userId,
                roomId,
                checkInDate,
                checkOutDate,
                totalPrice,
            }))
        );

        // Update room bookings in MongoDB
        await Room.updateMany(
            { _id: { $in: roomIds } },
            {
                $push: {
                    bookings: { checkInDate, checkOutDate, userId, totalPrice }
                },
                $set: { isBooked: true }
            }
        );

        res.status(201).json({ message: "Rooms booked successfully", bookings: newBookings });

    } catch (error) {
        console.error("Error booking rooms:", error);
        res.status(500).json({ message: "Error booking rooms", error: error.stack || error.message });
    }
};



export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "firstName lastName email") // Show user details
            .populate("roomId", "roomNumber roomCategory price"); // Show room details
        
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving bookings", error: error.message });
    }
};

/**
 * @desc Cancel a booking
 * @route DELETE /api/bookings/:id
 * @access Public
 */
export const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Remove booking from the room
        await Room.updateOne(
            { _id: booking.roomId },
            { $pull: { bookings: { _id: booking._id } } }
        );

        // Delete booking
        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
};
