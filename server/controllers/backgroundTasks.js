import mongoose from 'mongoose';
import Room from '../models/Room.js';
import HotelBooking from '../models/HotelBooking.js';
import connectDB from '../config/db.js';
import moment from 'moment-timezone';

//update room status
const updateRoomStatus = async () => {
    try {
        console.log("Running scheduled task to update room status...");

        // const expiredBookings = await HotelBooking.find({
        //     checkOutDate: { $lt: new Date() }
        // });

        const now = moment.tz("Asia/Colombo"); 
        const cutoffTime = now.clone().hour(12).minute(0).second(0).millisecond(0);

        // Find bookings that checked out before 12 PM 
        const expiredBookings = await HotelBooking.find({
            checkOutDate: { $lt: cutoffTime.toDate() }
        });


        console.log(`Found ${expiredBookings.length} expired bookings.`)

        if (expiredBookings.length === 0) {
            console.log("No expired bookings found."); // Log if no bookings are expired
            return 0;
        }

        let updated = 0;
        for (let i = 0; i < expiredBookings.length; i++) {
            const booking = expiredBookings[i];

            // Fetch the room - it's important to fetch the existing document
            const room = await Room.findById(booking.roomId);

            if (!room) {
                console.warn(`Room with ID ${booking.roomId} not found!`);
                continue;
            }
            console.log(booking);
            // Construct and use the correct $pull operation to remove the booking
             await Room.updateOne(
                { _id: booking.roomId },
                { $pull: { bookings: booking._id } }
            );

            if (room.bookings.length <= 1 ) {
                room.isBooked = false;
                await room.save();
            }
             updated++;
        }
        console.log("test and Updated " + updated + " rooms.");

    } catch (error) {
        console.error("Error updating room status:", error);
    }
};

// Set up the interval in ms
const interval = 24 * 60 * 60 * 1000;

export const startScheduledTasks = async () => {

    console.log("Starting scheduled tasks...");
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log("Database connected successfully before running scheduled tasks.");
        } else {
            console.log("Already connected to the database.");
        }
        await updateRoomStatus();
        setInterval(updateRoomStatus, interval);

    } catch (error) {
        console.error("Error starting scheduled tasks:", error);
    }
};