import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: Date,
  people: Number,
  destination: String,
  price: Number
});

const Booking = mongoose.model('Booking', bookingSchema);

// Export the Booking model using ES modules
export default Booking;  // Default export
