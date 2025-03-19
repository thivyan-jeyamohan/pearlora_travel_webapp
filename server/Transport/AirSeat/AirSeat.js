import mongoose from "mongoose";

const airSeatSchema = new mongoose.Schema({
  travelId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'AirTaxiTravel' },
  airtaxiName: { type: String, required: true },
  departure: { type: String, required: true },
  departure_datetime: { type: String, required: true },
  destination: { type: String, required: true },
  destination_datetime: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  seats: { type: [String], required: true }, // Array of strings
  bookedSeats: { type: [String], default: [] }, // Array of strings for booked seats
  nonSelectableSeats: { type: [String], default: [] }, // Array of strings for non-selectable seats
});

const AirSeat = mongoose.model("AirSeat", airSeatSchema);

export default AirSeat;