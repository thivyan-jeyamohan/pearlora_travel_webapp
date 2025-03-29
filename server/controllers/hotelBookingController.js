import Booking from "../models/HotelBooking.js";
import Room from "../models/Room.js";

export const bookRoom = async (req, res) => {
    try {
        const { userId, roomIds, checkInDate, checkOutDate, totalPrice,firstName,lastName,email,phone,specialRequests, } = req.body;

        // Validate input
        if (!userId || !roomIds || !checkInDate || !checkOutDate || !totalPrice || !Array.isArray(roomIds) || roomIds.length === 0 || !firstName || !lastName || !email || !phone) {
            return res.status(400).json({ message: "All fields are required, and roomIds must be a non-empty array" });
        }

        
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
                firstName,        
                lastName,
                email,
                phone,
                specialRequests,
            });
            await newBooking.save();

            // Update room bookings in MongoDB
            await Room.findByIdAndUpdate(roomId, {
                $push: { bookings: newBooking._id },
                isBooked: true 
            });

            return newBooking;
        }));


        res.status(201).json({ message: "Rooms booked successfully", bookings: newBookings });

    } catch (error) {
        console.error("Error booking rooms:", error);
        res.status(500).json({ message: "Error booking rooms", error: error.stack || error.message });
    }
};




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

        
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        
        await Room.updateOne(
            { _id: booking.roomId }, 
            { $pull: { bookings: bookingId } } 
        );

        
        const room = await Room.findById(booking.roomId);
        if (!room) { 
            console.warn(`Room with ID ${booking.roomId} not found after cancelling booking ${bookingId}`);
            return res.status(500).json({ message: "Error cancelling booking: Room not found" });
        }

        
        if (room.bookings.length === 0) {
            room.isBooked = false;
            await room.save();
        }

        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: "Booking cancelled successfully" });

    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
};



export const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { checkInDate, checkOutDate, totalPrice, firstName, lastName, email, phone, specialRequests } = req.body; 

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (!checkInDate || !checkOutDate || !totalPrice || !firstName || !lastName || !email || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Convert dates to Date objects
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        

        const existingBookings = await Booking.find({
            roomId: { $in: booking.roomId },
            _id: { $ne: bookingId }, 
            $or: [
                { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
            ]
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: "One or more rooms are already booked for these dates" });
        }


        booking.checkInDate = checkIn;
        booking.checkOutDate = checkOut;
        booking.totalPrice = totalPrice;
        booking.firstName = firstName;
        booking.lastName = lastName;
        booking.email = email;
        booking.phone = phone;
        booking.specialRequests = specialRequests;

        const updatedBooking = await booking.save();

        res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });

    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ message: "Error updating booking", error: error.stack || error.message });
    }
};