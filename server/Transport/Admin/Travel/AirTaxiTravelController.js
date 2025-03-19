import AirTaxiTravel from "./AirTaxiTravel.js";
import AirSeat from "../../AirSeat/AirSeat.js"; // Import the AirSeat model

export const addTravel = async (req, res) => {
  try {
    const { airtaxiName, departure, departure_datetime, destination, destination_datetime, ticket_price, seats } = req.body;

    // Validate departure and destination times
    const now = new Date();
    const departureTime = new Date(departure_datetime);
    const destinationTime = new Date(destination_datetime);

    if (departureTime - now < 2 * 60 * 60 * 1000) {
      return res.status(400).json({ error: "Departure time must be at least 2 hours from now." });
    }

    if (destinationTime <= departureTime) {
      return res.status(400).json({ error: "Destination time must be later than departure time." });
    }

    // Create new travel entry
    const newTravel = new AirTaxiTravel({
      airtaxiName,
      departure,
      departure_datetime,
      destination,
      destination_datetime,
      ticket_price,
      seats,
    });

    const savedTravel = await newTravel.save();

    // Create a new AirSeat entry with 100 seats
    const seatsArray = Array.from({ length: 100 }, (_, i) => `Seat ${i + 1}`);
    const newAirSeat = new AirSeat({
      travelId: savedTravel._id,
      airtaxiName: savedTravel.airtaxiName,
      departure: savedTravel.departure,
      departure_datetime: savedTravel.departure_datetime,
      destination: savedTravel.destination,
      destination_datetime: savedTravel.destination_datetime,
      ticket_price: savedTravel.ticket_price,
      seats: seatsArray, // All 100 seats
      bookedSeats: [], // Initially, no seats are booked
      nonSelectableSeats: [], // No non-selectable seats initially
    });

    await newAirSeat.save();

    res.status(201).json({ message: "Travel added successfully", travel: savedTravel });
  } catch (error) {
    console.error("Error adding travel:", error);
    res.status(500).json({ error: "Failed to add travel" });
  }
};

// Other controller methods (getAllTravels, getTravelById, updateTravel, deleteTravel) remain unchanged

// Get all travels
export const getAllTravels = async (req, res) => {
  try {
    const travels = await AirTaxiTravel.find();
    res.status(200).json(travels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch travels" });
  }
};

// Get travel by ID
export const getTravelById = async (req, res) => {
  try {
    const travel = await AirTaxiTravel.findById(req.params.id);
    if (!travel) return res.status(404).json({ error: "Travel not found" });
    res.status(200).json(travel);
  } catch (error) {
    res.status(500).json({ error: "Error fetching travel details" });
  }
};

// Update travel details
export const updateTravel = async (req, res) => {
  try {
    const updatedTravel = await AirTaxiTravel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTravel) return res.status(404).json({ error: "Travel not found" });
    res.status(200).json({ message: "Travel updated successfully", travel: updatedTravel });
  } catch (error) {
    res.status(500).json({ error: "Failed to update travel" });
  }
};

// Delete travel
export const deleteTravel = async (req, res) => {
  try {
    const deletedTravel = await AirTaxiTravel.findByIdAndDelete(req.params.id);
    if (!deletedTravel) return res.status(404).json({ error: "Travel not found" });
    res.status(200).json({ message: "Travel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete travel" });
  }
};
