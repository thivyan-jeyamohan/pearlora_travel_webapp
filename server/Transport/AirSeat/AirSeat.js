import mongoose from "mongoose";

const airSeatSchema = new mongoose.Schema({
  travelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "AirTaxiTravel",
  },
  airtaxiName: { type: String, required: true },
  departure: { type: String, required: true },
  departure_datetime: { type: String, required: true },
  destination: { type: String, required: true },
  destination_datetime: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  seats: { type: [String], required: true }, 
  bookedSeats: { type: [String], default: [] }, 
  nonSelectableSeats: { type: [String], default: [] }, 
});

const AirSeat = mongoose.model("AirSeat", airSeatSchema);

export default AirSeat;
