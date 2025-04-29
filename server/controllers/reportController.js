import Booking from "../models/HotelBooking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import moment from 'moment';
import mongoose from 'mongoose'; 

export const getReport = async (req, res) => {
    try {
        console.log("Generating Report with:", req.query);
        const query = {};
        let roomIds = [];

        // Search term logic 
        if (req.query.searchTerm) {
            const searchRegex = new RegExp(req.query.searchTerm, 'i');  

            
            const bookings = await Booking.find({ bookingId: searchRegex }).select('_id bookingId');
            if (bookings.length > 0) {
                const bookingIds = bookings.map(booking => booking._id);
                query._id = { $in: bookingIds };  
            } else {
                
                const hotels = await Hotel.find({ name: searchRegex }).select('_id');
                const hotelIds = hotels.map(h => h._id);

                if (hotelIds.length > 0) {
                    
                    const rooms = await Room.find({ hotelId: { $in: hotelIds } }).select('_id');
                    roomIds = rooms.map(r => r._id);
                    query.roomId = { $in: roomIds };
                } else {
                    return res.status(200).json([]);
                }
            }
        }

        // Hotel filter 
        if (req.query.hotelId) {
            const rooms = await Room.find({ hotelId: req.query.hotelId }).lean();
            const hotelRoomIds = rooms.map(room => room._id);
            if (hotelRoomIds.length === 0) {
                return res.status(200).json([]); 
            }

            
            if (roomIds.length > 0) {
                const commonRoomIds = hotelRoomIds.filter(id => roomIds.includes(id));
                if (commonRoomIds.length === 0) return res.status(200).json([]); 
                query.roomId = { $in: commonRoomIds };
            } else {
                query.roomId = { $in: hotelRoomIds };
            }
        }

        // Room filter 
        if (req.query.roomId) {
            query.roomId = req.query.roomId;
        }

        // Date range filters
        if (req.query.checkInDate && req.query.checkOutDate) {
            const checkIn = new Date(req.query.checkInDate);
            const checkOut = new Date(req.query.checkOutDate);
        
            if (checkOut <= checkIn) {
                return res.status(400).json({ message: "Check-out date must be after check-in date" });
            }
        
            query.checkInDate = { $gte: checkIn };
            query.checkOutDate = { $lte: checkOut };
        }
        

        console.log("Generated database query:", query);

        
        const bookings = await Booking.find(query).lean();

        
        const reportData = await Promise.all(bookings.map(async (booking) => {
            let room, hotel;
            try {
                room = await Room.findById(booking.roomId).select('roomNumber hotelId').lean();
            } catch (roomError) {
                console.error(`Error finding room ${booking.roomId}:`, roomError);
                room = null; 
            }

            try {
                hotel = room ? await Hotel.findById(room.hotelId).select('name').lean() : null;
            } catch (hotelError) {
                console.error(`Error finding hotel for room ${room?._id}:`, hotelError);
                hotel = null; 
            }

            const checkInDate = moment(booking.checkInDate);
            const checkOutDate = moment(booking.checkOutDate);
            const daysStayed = checkOutDate.diff(checkInDate, 'days') + 1;

            return {
                ...booking,
                hotelName: hotel ? hotel.name : 'Unknown',
                roomNumber: room ? room.roomNumber : 'Unknown',
                daysStayed: daysStayed,
            };
        }));

        res.status(200).json(reportData);
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Error generating report", error: error.message });
    }
};
