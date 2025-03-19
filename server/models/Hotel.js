// backend/models/Hotel.js
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    roomCategory: {
        type: String,
        required: true
    },
    roomId:{ 
        type: String,
        required: true 
    },
    roomNumber:{ 
        type: String, 
        required: true
     },
    availabilityStatus:{ 
        type: Boolean, 
        default: true 
    },  
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    rooms: {
        type: [String], 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String, 
        required: true
    }
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
