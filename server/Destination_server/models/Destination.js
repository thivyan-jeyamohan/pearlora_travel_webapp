// models/Destination.js
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  latitude: { type: Number, required: true }, // Add latitude
  longitude: { type: Number, required: true } // Add longitude
});

module.exports = mongoose.model("Destination", destinationSchema);
