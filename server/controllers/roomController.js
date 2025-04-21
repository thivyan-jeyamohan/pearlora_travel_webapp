import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import HotelBooking from "../models/HotelBooking.js";
import moment from 'moment-timezone';  

// Check room availability
export const checkRoomAvailability = async (req, res) => {
    try {
        const { hotelId, checkInDate, checkOutDate } = req.body;

        if (!hotelId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const checkIn = moment.utc(checkInDate);
        const checkOut = moment.utc(checkOutDate);

        if (!checkIn.isValid() || !checkOut.isValid()) {
            return res.status(400).json({ message: "Invalid date format.  Please use ISO 8601 UTC format." });
        }

        const rooms = await Room.find({ hotelId: hotelId }).populate('bookings');

        if (!rooms || rooms.length === 0) {
            return res.status(200).json({ availableRooms: [] }); 
        }

        const availableRooms = rooms.filter(room => {
            if (!room.bookings || room.bookings.length === 0) {
                return true;
            }

            return !room.bookings.some(booking => {  

                const bookingCheckIn = moment.utc(booking.checkInDate);
                const bookingCheckOut = moment.utc(booking.checkOutDate);

                return bookingCheckIn < checkOut && bookingCheckOut > checkIn;

            });
        });

        res.status(200).json({ availableRooms: availableRooms });

    } catch (error) {
        console.error("Error checking room availability:", error);
        res.status(500).json({ message: "Error checking room availability", error: error.message });
    }
};


export const createRoom = async (req, res) => {
    try {
        const { hotelId } =await req.body;

        if (!hotelId) {
            return res.status(400).json({ message: "hotelId is required in the request body" });
        }
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found with provided hotelId" });
        }

        try {
            const newRoom = new Room(req.body);
            await newRoom.save();           

           
            hotel.rooms.push(newRoom._id);
            await hotel.save();

            res.status(201).json({ message: "Room created successfully", room: newRoom });

        } catch (roomError) {
            console.error("Error creating and saving room:", roomError);

            if (roomError.name === 'ValidationError') {
                const errors = {};
                for (const field in roomError.errors) {
                    errors[field] = roomError.errors[field].message; 
                }

                return res.status(400).json({ message: "Validation error creating room", errors: errors });
            }
            return res.status(500).json({ message: "Error creating and saving room", error: roomError.message });

        }

    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Error creating room", error: error.message });
    }
};


export const getRooms = async (req, res) => {
    try {
        const { hotelId } = req.query; 
        const query = hotelId ? { hotelId } : {};
        const rooms = await Room.find(query);
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateRoom = async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) return res.status(404).json({ message: "Room not found" });

        await Hotel.updateOne(
            { rooms: req.params.id },
            { $pull: { rooms: req.params.id } }
        );

        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};