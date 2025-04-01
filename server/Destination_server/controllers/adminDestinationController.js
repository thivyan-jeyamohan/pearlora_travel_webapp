const AdminDestination = require("../models/AdminDestination");
const mongoose = require("mongoose");

exports.addDestination = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    console.log("Received Files:", req.files);

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const newDestination = new AdminDestination({
      ...req.body,
      images: imagePaths,
    });

    await newDestination.save();
    res.status(201).json({ message: "Destination added successfully", destination: newDestination });
  } catch (error) {
    console.error("❌ Error adding destination:", error);
    res.status(500).json({ message: "Error adding destination", error });
  }
};

exports.getDestinations = async (req, res) => {
  try {
    const destinations = await AdminDestination.find();
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching destinations", error });
  }
};

exports.getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Processing getDestinationById with id:", id); // Debug

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    const destination = await AdminDestination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ message: "Error fetching destination", error });
  }
};

exports.updateDestination = async (req, res) => {
  try {
    const { id } = req.params;

    let existingDestination = await AdminDestination.findById(id);
    if (!existingDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const newImagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const updatedData = {
      ...req.body,
      images: newImagePaths.length > 0 ? newImagePaths : existingDestination.images,
    };

    const updatedDestination = await AdminDestination.findByIdAndUpdate(id, updatedData, { new: true });
    console.log("success");
    res.status(200).json({ message: "Destination updated successfully", updatedDestination });
  } catch (error) {
    console.error("❌ Error updating destination:", error);
    res.status(500).json({ message: "Error updating destination", error });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    await AdminDestination.findByIdAndDelete(id);
    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting destination", error });
  }
};
exports.searchDestinations = async (req, res) => {
  try {
    console.log("Processing searchDestinations with query:", req.query); // Debug
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location parameter is required" });
    }

    const destinations = await AdminDestination.find({
      location: { $regex: new RegExp(location, "i") },
    });

    if (destinations.length === 0) {
      return res.status(404).json({ message: "No destinations found" });
    }

    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error searching destinations:", error);
    res.status(500).json({ message: "Server error" });
  }
};