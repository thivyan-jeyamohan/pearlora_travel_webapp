import Booking from "../models/HotelBooking.js";
import Room from "../models/Room.js";

export const bookRoom = async (req, res) => {
    try {
        const { userId, roomIds, checkInDate, checkOutDate, totalPrice } = req.body;

        // Validate input
        if (!userId || !roomIds || !checkInDate || !checkOutDate || !totalPrice || !Array.isArray(roomIds) || roomIds.length === 0) {
            return res.status(400).json({ message: "All fields are required, and roomIds must be a non-empty array" });
        }

        // Convert dates to Date objects for accurate comparison
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);


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
        const newBookings = await Promise.all(roomIds.map(async roomId => {
            const newBooking = new Booking({
                userId,
                roomId,
                checkInDate,
                checkOutDate,
                totalPrice,
            });
            await newBooking.save();

            // Update room bookings in MongoDB
            await Room.findByIdAndUpdate(roomId, {
                $push: { bookings: newBooking._id },
                isBooked: true // Set isBooked to true
            });

            return newBooking;
        }));


        res.status(201).json({ message: "Rooms booked successfully", bookings: newBookings });

    } catch (error) {
        console.error("Error booking rooms:", error);
        res.status(500).json({ message: "Error booking rooms", error: error.stack || error.message });
    }
};

// change this code laterly


export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error retrieving bookings:", error);
        res.status(500).json({ message: "Error retrieving bookings", error: error.message });
    }
};



export const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        // 1. Find the booking by its ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // 2. Remove the booking ID from the corresponding room's 'bookings' array
        await Room.updateOne(
            { _id: booking.roomId }, // Find the room by its ID
            { $pull: { bookings: bookingId } } // Remove the bookingId from the array
        );

        // 3. Find the room again to get the updated 'bookings' array
        const room = await Room.findById(booking.roomId);
        if (!room) { // Check for the case where the room might have been deleted
            console.warn(`Room with ID ${booking.roomId} not found after cancelling booking ${bookingId}`);
            return res.status(500).json({ message: "Error cancelling booking: Room not found" });
        }

        // 4. Check if the 'bookings' array is now empty
        if (room.bookings.length === 0) {
            // 5. If the array is empty, set 'isBooked' to false and save the room
            room.isBooked = false;
            await room.save();
        }

        // 6. Delete the booking itself
        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: "Booking cancelled successfully" });

    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
};