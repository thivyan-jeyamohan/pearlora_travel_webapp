import Hotel from '../models/Hotel.js';
import Room from "../models/Room.js";
import { nanoid } from 'nanoid';


export const updateHotelAvailability = async (hotelId) => {
    try {
        
        const hotel = await Hotel.findById(hotelId).populate('rooms');
        if (!hotel) {
            console.log(`Hotel with ID ${hotelId} not found.`);
            return;
        }

        // Check if all rooms are booked
        const allRoomsBooked = hotel.rooms.every(room => room.isBooked);

        
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
        const { name, location, price, availabilityStatus, rating, description, coverPhoto } = req.body;

        if (!coverPhoto) { 
            return res.status(400).json({ message: "Cover photo is required" });
        }

        //auto id
        const randomPart = nanoid(3); 
        const newHotelId = `PearlH-${randomPart}`; 

        const newHotel = new Hotel({
            name,
            location,
            price,
            availabilityStatus,
            rating,
            description,
            coverPhoto, // Store Base64 encoded string
            hotelId:newHotelId,
        });

        await newHotel.save();
        res.status(201).json(newHotel);
    } catch (error) {
        console.error("Error creating hotel:", error);
        res.status(500).json({ message: "Error creating hotel", error: error.message }); 
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
            { new: true, runValidators: true } 
        );

        if (!updatedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.json(updatedHotel); 
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ message: "Error updating hotel", error: error.message }); 
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
        res.status(500).json({ message: "Error deleting hotel", error: error.message }); 
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
        res.status(500).json({ message: "Error fetching hotels", error: error.message }); 
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
        res.status(500).json({ message: "Error fetching hotel", error: error.message }); 
    }
};