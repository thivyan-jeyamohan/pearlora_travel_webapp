import Booking from "../models/HotelBooking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import moment from 'moment';
import mongoose from 'mongoose'; 

export const getReport = async (req, res) => {
    try {
        console.log("Generating Report with:", req.query);
        const query = {};

        // Booking ID Query
        // if (req.query.bookingId) {
        //     try {
        //         query._id = new mongoose.Types.ObjectId(req.query.bookingId); 
        //     } catch (error) {
        //         return res.status(400).json({ message: "Invalid bookingId format" }); 
        //     }
        // }

        let roomIds = [];
        if (req.query.hotelId) {
            const rooms = await Room.find({ hotelId: req.query.hotelId }).lean();
            roomIds = rooms.map(room => room._id);
            if (roomIds.length === 0) {
                return res.status(200).json([]);
            }
            query.roomId = { $in: roomIds };
        }

        if (req.query.roomId) {
            query.roomId = req.query.roomId;
        }

        // Date range filters
        if (req.query.checkInDateFrom || req.query.checkInDateTo) {
            query.checkInDate = {};
            if (req.query.checkInDateFrom) {
                query.checkInDate.$gte = new Date(req.query.checkInDateFrom);
            }
            if (req.query.checkInDateTo) {
                query.checkInDate.$lte = new Date(req.query.checkInDateTo);
            }
        }

        if (req.query.checkOutDateFrom || req.query.checkOutDateTo) {
            query.checkOutDate = {};
            if (req.query.checkOutDateFrom) {
                query.checkOutDate.$gte = new Date(req.query.checkOutDateFrom);
            }
            if (req.query.checkOutDateTo) {
                query.checkOutDate.$lte = new Date(req.query.checkOutDateTo);
            }
        }

        console.log("Generated database query:", query);

        const bookings = await Booking.find(query).lean();


        const reportData = await Promise.all(bookings.map(async (booking) => {
            let room, hotel;
            try {
                room = await Room.findById(booking.roomId).select('roomNumber hotelId').lean();;
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
            const daysStayed = checkOutDate.diff(checkInDate, 'days');

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