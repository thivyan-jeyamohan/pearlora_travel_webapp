import mongoose from "mongoose";

const basicrideBookingSchema = new mongoose.Schema({
  pickupLocation: { type: String, required: true },
  email: { type: String, required: true },
  passengerCount: { type: Number, required: true },
  selectedDate: { type: String, required: true },
  selectedTime: { type: String, required: true },
  vehicleType: { type: String, required: true }
});

const RideBooking = mongoose.model("RideBooking", basicrideBookingSchema);
export default RideBooking;
