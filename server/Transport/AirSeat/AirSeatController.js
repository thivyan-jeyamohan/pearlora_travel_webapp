import mongoose from "mongoose";

import AirSeat from "./AirSeat.js";

// Add a new AirSeat entry
export const addAirSeat = async (req, res) => {
  try {
    const {
      travelId,
      airtaxiName,
      departure,
      departure_datetime,
      destination,
      destination_datetime,
      ticket_price,
      seats,
    } = req.body;

    const newAirSeat = new AirSeat({
      travelId,
      airtaxiName,
      departure,
      departure_datetime,
      destination,
      destination_datetime,
      ticket_price,
      seats,
    });

    const savedAirSeat = await newAirSeat.save();
    res
      .status(201)
      .json({ message: "AirSeat added successfully", airSeat: savedAirSeat });
  } catch (error) {
    console.error("Error adding AirSeat:", error);
    res.status(500).json({ error: "Failed to add AirSeat" });
  }
};

// Get all AirSeat entries
export const getAllAirSeats = async (req, res) => {
  try {
    const airSeats = await AirSeat.find();
    res.status(200).json(airSeats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch AirSeats" });
  }
};

// Get AirSeat by travelId
export const getAirSeatById = async (req, res) => {
  try {
    const airSeatId = new mongoose.Types.ObjectId(req.params.id); // Convert string to ObjectId
    console.log("Fetching AirSeat for _id:", airSeatId); // Debug log

    const airSeat = await AirSeat.findById(airSeatId); // Query by _id
    if (!airSeat)
      return res
        .status(404)
        .json({ success: false, error: "AirSeat not found" });

    res.status(200).json({ success: true, airSeat });
  } catch (error) {
    console.error("Error fetching AirSeat details:", error); // Debug log
    res
      .status(500)
      .json({ success: false, error: "Error fetching AirSeat details" });
  }
};

// Update AirSeat (book seats)

export const updateAirSeat = async (req, res) => {
  try {
    const { bookedSeats, unbookedSeats } = req.body; // Get both booked & unbooked seats
    const airSeatId = req.params.travelId;

    if (!mongoose.Types.ObjectId.isValid(airSeatId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }

    const airSeat = await AirSeat.findById(airSeatId);

    if (!airSeat) {
      return res
        .status(404)
        .json({ success: false, error: "AirSeat not found" });
    }

    // Add new booked seats (avoid duplicates)
    airSeat.bookedSeats = [
      ...new Set([...airSeat.bookedSeats, ...bookedSeats]),
    ];

    // Remove unbooked seats from the list
    airSeat.bookedSeats = airSeat.bookedSeats.filter(
      (seat) => !unbookedSeats.includes(seat),
    );

    await airSeat.save();

    res
      .status(200)
      .json({ success: true, message: "Seats updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, error: "Failed to update seats" });
  }
};
