import Hotel from '../models/Hotel.js';
import Room from "../models/Room.js";

// Helper function to update hotel availability
export const updateHotelAvailability = async (hotelId) => {
    try {
        // Fetch the hotel with its rooms
        const hotel = await Hotel.findById(hotelId).populate('rooms');
        if (!hotel) {
            console.log(`Hotel with ID ${hotelId} not found.`);
            return;
        }

        // Check if all rooms are booked
        const allRoomsBooked = hotel.rooms.every(room => room.isBooked);

        // Update the hotel's availability status
        hotel.availabilityStatus = !allRoomsBooked;
        await hotel.save();

        console.log(`Hotel ${hotel.name} availability updated to ${hotel.availabilityStatus}`);
    } catch (error) {
        console.error("Error updating hotel availability:", error);
    }
};


// CREATE HOTEL
export const createHotel = async (req, res) => {
    try {
        const { hotelId, name, location, price, availabilityStatus, rating, description, coverPhoto } = req.body;

        if (!coverPhoto) { // Check on the backend as well
            return res.status(400).json({ message: "Cover photo is required" });
        }

        const newHotel = new Hotel({
            hotelId,
            name,
            location,
            price,
            availabilityStatus,
            rating,
            description,
            coverPhoto, // Store Base64 encoded string
        });

        await newHotel.save();
        res.status(201).json(newHotel);
    } catch (error) {
        console.error("Error creating hotel:", error);
        res.status(500).json({ message: "Error creating hotel", error: error.message }); // Send more specific error
    }
};

// UPDATE HOTEL
export const updateHotel = async (req, res) => {
    try {
        const { name, location, price, rating, description, coverPhoto } = req.body;

        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            {
                name,
                location,
                price,
                rating,
                description,
                coverPhoto, // Store Base64 encoded string
            },
            { new: true, runValidators: true } // Add runValidators
        );

        if (!updatedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.json(updatedHotel); // Respond with the updated hotel
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ message: "Error updating hotel", error: error.message }); // Send more specific error
    }
};

// DELETE HOTEL
export const deleteHotel = async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);

        if (!deletedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.json({ message: "Hotel deleted" });
    } catch (error) {
        console.error("Error deleting hotel:", error);
        res.status(500).json({ message: "Error deleting hotel", error: error.message }); // Send more specific error
    }
};

// GET HOTELS
export const getHotels = async (req, res) => {
    try {
        const { location } = req.query;
        const query = location ? { location: new RegExp(location, "i") } : {};
        const hotels = await Hotel.find(query);
        res.json(hotels);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ message: "Error fetching hotels", error: error.message }); // Send more specific error
    }
};

// GET HOTEL BY ID
export const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('rooms');

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.json(hotel);
    } catch (error) {
        console.error("Error fetching hotel by ID:", error);
        res.status(500).json({ message: "Error fetching hotel", error: error.message }); // Send more specific error
    }
};