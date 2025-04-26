// models/FlightBooking.js
import mongoose from 'mongoose';

const FlightBookingSchema = new mongoose.Schema({
  travelId: { type: String, required: true },
  airtaxiName: { type: String, required: true },
  departure: { type: String, required: true },
  departure_datetime: { type: String, required: true },
  destination: { type: String, required: true },
  destination_datetime: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  bookedSeats: { type: [String], required: true },
  totalPrice: { type: Number, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

const FlightBooking = mongoose.model('FlightBooking', FlightBookingSchema);
export default FlightBooking;
