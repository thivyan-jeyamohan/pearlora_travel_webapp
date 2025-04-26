import mongoose from "mongoose";

const basicrideBookingSchema = new mongoose.Schema({
  pickupLocation: { type: String, required: true },
  email: { type: String, required: true },
  passengerCount: { type: Number, required: true },
  days: { type: Number, required: true },
  selectedDateTime: { type: Date, required: true },
  vehicleType: { type: String, required: true },
  totalAmount: { type: Number, required: true },
});

const RideBooking = mongoose.model("RideBooking", basicrideBookingSchema);
export default RideBooking;