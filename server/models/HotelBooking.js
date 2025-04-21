import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const bookingSchema = new mongoose.Schema({
  bookingId: {type: String,required: true,unique: true,index: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }], 
  allRoomIds: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Room'}],
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  firstName: { type: String, required: true },     
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  specialRequests: { type: String },
},{ timestamps: true });

const HotelBooking = mongoose.model("HotelBooking", bookingSchema);

export default HotelBooking;