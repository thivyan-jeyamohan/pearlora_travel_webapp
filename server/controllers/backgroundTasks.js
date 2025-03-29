import mongoose from 'mongoose';
import Room from '../models/Room.js';
import HotelBooking from '../models/HotelBooking.js';
import connectDB from '../config/db.js';
import moment from 'moment-timezone';

//update room status
const updateRoomStatus = async () => {
    try {
        console.log("Running scheduled task to update room status...");

        const expiredBookings = await HotelBooking.find({
            checkOutDate: { $lt: new Date() }
        });
        console.log(`Found ${expiredBookings.length} expired bookings.`)

        if (expiredBookings.length == 0)
            return 0;

        let updated = 0;
        for (let i = 0; i < expiredBookings.length; i++) {
            const booking = expiredBookings[i];

            const room = await Room.findById(booking.roomId)
            if (room && room.isBooked) {
                room.isBooked = false;
                await room.save();  

                updated++;
            }else{
                console.log('Data Updated Already')
            }
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
        updateRoomStatus();
        setInterval(updateRoomStatus, interval);

    } catch (error) {
        console.error("Error starting scheduled tasks:", error);
    }
};