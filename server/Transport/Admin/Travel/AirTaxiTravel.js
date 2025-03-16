
import mongoose from "mongoose";


const airTaxiTravelSchema = new mongoose.Schema({
  airtaxiName: { type: String, required: true },
  departure: { type: String, required: true },
  departure_datetime: { type: String, required: true },
  destination: { type: String, required: true },
  destination_datetime: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  seats: { type: Number, required: true },
});

// Add a post-save middleware to copy the data to AirTaxiTravelHistory
airTaxiTravelSchema.post('save', async function(doc) {
  try {
    // Initialize available seats, selected seats, and canNotSelectSeats
    const selectedSeats = 0;  // Initially, no seats are selected
    const availableSeats = doc.seats;  // Set available seats equal to the total number of seats
    const canNotSelectSeats = 0;  // Initially, seats can be selected

    // Create a new document for AirTaxiTravelHistory
    const newHistory = new SeatModel({
      airTaxiTravelId: doc._id, // Save the _id of the AirTaxiTravel document
      airtaxiName: doc.airtaxiName,
      departure: doc.departure,
      departure_datetime: doc.departure_datetime,
      destination: doc.destination,
      destination_datetime: doc.destination_datetime,
      ticket_price: doc.ticket_price,
      seats: doc.seats,
      selectedSeats,  // Default 0 selected seats
      availableSeats,  // Set available seats to the total number of seats
      canNotSelectSeats,  // Set flag to 0 (false) initially
    });

    // Save to the history collection
    await newHistory.save();
    console.log('Data copied to AirTaxiTravelHistory collection');
  } catch (err) {
    console.error('Error copying data to history:', err);
  }
});

const AirTaxiTravel = mongoose.model("AirTaxiTravel", airTaxiTravelSchema);

export default AirTaxiTravel;
