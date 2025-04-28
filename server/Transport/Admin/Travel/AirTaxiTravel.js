import mongoose from "mongoose";

const airTaxiTravelSchema = new mongoose.Schema({
  airtaxiName: { type: String, required: true },
  departure: { type: String, required: true },
  departure_datetime: { type: String, required: true },
  destination: { type: String, required: true },
  destination_datetime: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  seats: { type: Number, required: true },
  airtaxicompanymail:{type: String, required: true}
});

const AirTaxiTravel = mongoose.model("AirTaxiTravel", airTaxiTravelSchema);

export default AirTaxiTravel;
