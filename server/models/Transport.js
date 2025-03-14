import mongoose from "mongoose";

// Define schema for transport options
const transportSchema = new mongoose.Schema({
  type: String,  // "basic" (car, bike) or "express" (train, air taxi)
  vehicle: String, // Name of the vehicle
  seats: Number, // Available seats
  price: Number // Price per seat
});

// Export the Transport model
export default mongoose.model("Transport", transportSchema);
