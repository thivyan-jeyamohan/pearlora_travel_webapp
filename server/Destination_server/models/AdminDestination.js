const mongoose = require("mongoose");

const AdminDestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  images: { type: [String], required: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("AdminDestination", AdminDestinationSchema, "admin_destinations");
