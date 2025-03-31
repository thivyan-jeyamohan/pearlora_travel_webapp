import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomNumber: { type: Number, required: true },
    photo: { type: String, required: true },
    price: { type: Number, required: true },
    roomCategory: {
        type: String,
        enum: ['Single', 'Double', 'Suite'],
        required: true
    },
    isBooked: { type: Boolean, default: false },  
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "HotelBooking" }],
},{ timestamps: true });

roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.model("Room", roomSchema);
export default Room;