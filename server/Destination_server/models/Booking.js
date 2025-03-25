const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  people: { type: Number, required: true },
  destination: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model("Booking", BookingSchema);
