import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import moment from 'moment-timezone';  // Import moment-timezone

// Check room availability
export const checkRoomAvailability = async (req, res) => {
    try {
        const { hotelId, checkInDate, checkOutDate } = req.body;

        if (!hotelId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

      // Use moment-timezone to parse dates in UTC
      const checkIn = moment.utc(checkInDate);
      const checkOut = moment.utc(checkOutDate);

      if (!checkIn.isValid() || !checkOut.isValid()) {
        return res.status(400).json({ message: "Invalid date format.  Please use ISO 8601 UTC format." });
      }


        // Find all rooms for the given hotel
        const rooms = await Room.find({ hotelId: hotelId });

        if (!rooms || rooms.length === 0) {
            return res.status(200).json({ availableRooms: [] }); // No rooms found for the hotel
        }

        // Filter out rooms that are booked during the given date range
      const availableRooms = rooms.filter(room => {
        return !room.bookings.some(booking => {
          //Parse booking dates as UTC
          const bookingCheckIn = moment.utc(booking.checkInDate);
          const bookingCheckOut = moment.utc(booking.checkOutDate);

          // Check if the booking overlaps with the requested dates
          return bookingCheckIn < checkOut && bookingCheckOut > checkIn;
        });
      });


        // Respond with the available rooms
        res.status(200).json({ availableRooms: availableRooms });

    } catch (error) {
        console.error("Error checking room availability:", error);
        res.status(500).json({ message: "Error checking room availability", error: error.message });
    }
};



export const createRoom = async (req, res) => {
    try {
        const { hotelId } =await req.body;

        // 1. Validate hotelId
        if (!hotelId) {
            return res.status(400).json({ message: "hotelId is required in the request body" });
        }

        // 2. Find the Hotel
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found with provided hotelId" });
        }

        
        try {
            const newRoom = new Room(req.body);
            await newRoom.save();           

           
            hotel.rooms.push(newRoom._id);
            await hotel.save();

            // 5. Respond with Success
            res.status(201).json({ message: "Room created successfully", room: newRoom });

        } catch (roomError) {
            console.error("Error creating and saving room:", roomError);

            // Handle validation errors (e.g., missing required fields)
            if (roomError.name === 'ValidationError') {
                const errors = {};
                for (const field in roomError.errors) {
                    errors[field] = roomError.errors[field].message; // get the specific message
                }

                return res.status(400).json({ message: "Validation error creating room", errors: errors });
            }
            return res.status(500).json({ message: "Error creating and saving room", error: roomError.message });

        }

    } catch (error) {
        // Handle errors finding the hotel, or other top-level errors
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Error creating room", error: error.message });
    }
};

// Get all rooms (with optional hotel filter)
export const getRooms = async (req, res) => {
    try {
        const { hotelId } = req.query; // Filter by hotel
        const query = hotelId ? { hotelId } : {};
        const rooms = await Room.find(query);
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single room by ID
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update room details
export const updateRoom = async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a room
export const deleteRoom = async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) return res.status(404).json({ message: "Room not found" });

        // Also remove the room's reference from the Hotel
        await Hotel.updateOne(
            { rooms: req.params.id },
            { $pull: { rooms: req.params.id } }
        );

        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

