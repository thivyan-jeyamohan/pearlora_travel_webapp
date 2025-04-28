import Booking from "../models/HotelBooking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { sendEmail } from '../mail/mailService.js';
import { generateEmailContent } from '../mail/emailContent.js';
import moment from 'moment-timezone'; 
import { nanoid } from 'nanoid';

export const bookRoom = async (req, res) => {
    try {
        const { userId, roomIds, checkInDate, checkOutDate, totalPrice,firstName,lastName,email,phone,specialRequests, } = req.body;

        if (!userId || !roomIds || !checkInDate || !checkOutDate || !totalPrice || !Array.isArray(roomIds) || roomIds.length === 0 || !firstName || !lastName || !email || !phone) {
            return res.status(400).json({ message: "All fields are required, and roomIds must be a non-empty array" });
        }

        const sriLankaTimezone = 'Asia/Colombo';

        const checkIn = moment.tz(checkInDate, sriLankaTimezone).set({ hour: 14, minute: 0, second: 0, millisecond: 0 }).toDate();
        const checkOut = moment.tz(checkOutDate, sriLankaTimezone).set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toDate();


        const rooms = await Room.find({ _id: { $in: roomIds } });
        if (rooms.length !== roomIds.length) {
            return res.status(404).json({ message: "One or more rooms not found" });
        }

        for (const roomId of roomIds){
            const existingBookings = await Booking.find({
                roomId:  roomId ,  
                $or: [
                    { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
                ]
            });

            if (existingBookings.length > 0) {
                return res.status(400).json({ message: "One or more rooms are already booked for these dates" });
            }
        }

        //auto ids
        const randomPart = nanoid(5); 
        const newBookingId = `PEARL-${randomPart}`; 

        const placeholderBooking = new Booking({
            userId,
            roomId: roomIds[0], 
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice,
            firstName,
            lastName,
            email,
            phone,
            specialRequests,
            bookingId: newBookingId,
        });
        await placeholderBooking.save();

        for (const roomId of roomIds) {
            await Room.findByIdAndUpdate(roomId, {
                $push: { bookings: placeholderBooking._id },
                isBooked: true 
            });
        }

        await Booking.findByIdAndUpdate(placeholderBooking._id, {
            $set: {
                allRoomIds: roomIds 
            }
        });

        const hotel = await Hotel.findOne({ rooms: { $in: roomIds } });
        if (!hotel) {
            console.warn(`Hotel not found for rooms: ${roomIds.join(', ')}`);
            return res.status(500).json({ message: "Can't find hotels to send email confirmation", error: error.message });
        }
        let roomNumbers = ""
        for (let i = 0; i < rooms.length; i++) {
            roomNumbers += rooms[i].roomNumber + ", "
        }

        console.log("test : Number of booking to be " + roomNumbers)

        const { mailSubject, mailHtml } = generateEmailContent(
            firstName,
            lastName,
            hotel.name,
            roomNumbers,
            moment(checkIn).tz(sriLankaTimezone).format('YYYY-MM-DD [at] hh:mm A'),
            moment(checkOut).tz(sriLankaTimezone).format('YYYY-MM-DD [at] hh:mm A'),
            totalPrice,
            placeholderBooking.bookingId
        );

        await sendEmail(email, mailSubject, mailHtml);
        console.log("Successfully to send email at")

        res.status(201).json({ message: "Rooms booked successfully", booking: placeholderBooking });

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

        const roomIds = booking.allRoomIds;

        for (const roomId of roomIds) {
            await Room.updateOne(
                { _id: roomId },
                { $pull: { bookings: bookingId } }
            );
            const room = await Room.findById(roomId);
            if (!room) {
                console.warn(`Room with ID ${roomId} not found after cancelling booking ${bookingId}`);
                continue; 
            }

            if (room.bookings.length === 0) {
                room.isBooked = false;
                await room.save();
            }
        }
        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: "Booking cancelled successfully" });

    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
};

