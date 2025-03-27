import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }], 
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  firstName: { type: String, required: true },     
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  specialRequests: { type: String },
});

const HotelBooking = mongoose.model("HotelBooking", bookingSchema);

export default HotelBooking;