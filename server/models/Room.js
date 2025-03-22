import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true }, 
  category: { type: String, required: true }, 
  number: { type: Number, required: true }, 
  availability: { type: Boolean, default: true }, 
  price: { type: Number, required: true }, 
});

module.exports = mongoose.model("Room", RoomSchema);
