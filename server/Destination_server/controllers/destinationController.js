const Destination = require("../models/Destination");

// Add a new destination
exports.addDestination = async (req, res) => {
  try {
    console.log("Received request:", req.body);  // Debugging: Log request body
    console.log("Uploaded file:", req.file);     // Debugging: Log file info

    const { name, price, description } = req.body;
    const image = req.file ? req.file.path : null; // Store image path

    if (!name || !price || !description || !image) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newDestination = new Destination({ name, price, description, image });
    await newDestination.save();

    res.status(201).json({ success: true, message: "Destination added successfully", destination: newDestination });
  } catch (error) {
    console.error("Error in addDestination:", error);
    res.status(500).json({ success: false, message: "Error adding destination", error: error.message });
  }
};

// Get all destinations
exports.getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json({ success: true, data: destinations });
  } catch (error) {
    console.error("Error in getDestinations:", error);
    res.status(500).json({ success: false, message: "Error fetching destinations", error: error.message });
  }
};
