
import mongoose from "mongoose";

// Define the schema for AirTaxiTravelHistory
const SeatsSchema = new mongoose.Schema({
  airTaxiTravelId: { type: mongoose.Schema.Types.ObjectId, ref: "AirTaxiTravel" }, // Store reference to AirTaxiTravel _id
  airtaxiName: { type: String, required: true },
  departure: { type: String, required: true },
  departure_datetime: { type: String, required: true },
  destination: { type: String, required: true },
  destination_datetime: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  seats: { type: Number, required: true },
  selectedSeats: { type: Number, default: 0 },
  availableSeats: { type: Number, default: 0 },
  canNotSelectSeats: { type: Boolean, default: false },
});

// Create and export the AirTaxiTravelHistory model
const AirTaxiTravelHistory = mongoose.model("Seat", SeatsSchema);

export default AirTaxiTravelHistory;
