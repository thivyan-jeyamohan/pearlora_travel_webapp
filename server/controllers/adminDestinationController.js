// controllers/adminDestinationController.js

import AdminDestination from "../models/AdminDestination.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// ➕ Add Destination
const addDestination = async (req, res) => {
  try {
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const newDestination = new AdminDestination({
      ...req.body,
      images: imagePaths,
      category: req.body.category,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      status: req.body.status || 'Draft', // ⭐ Added
    });

    await newDestination.save();
    res.status(201).json({ message: "Destination added successfully", destination: newDestination });
  } catch (error) {
    console.error("❌ Error adding destination:", error);
    res.status(500).json({ message: "Error adding destination", error });
  }
};

// 📄 Get All Destinations (with optional filter)
const getDestinations = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const destinations = await AdminDestination.find(filter);
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching destinations", error });
  }
};

// 📄 Get Destination By ID
const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;

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

// ✏️ Update Destination
const updateDestination = async (req, res) => {
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
      category: req.body.category || existingDestination.category,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : existingDestination.tags,
      status: req.body.status || existingDestination.status, // ⭐ Added
    };

    const updatedDestination = await AdminDestination.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ message: "Destination updated successfully", updatedDestination });
  } catch (error) {
    console.error("❌ Error updating destination:", error);
    res.status(500).json({ message: "Error updating destination", error });
  }
};

// ❌ Delete Destination
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    await AdminDestination.findByIdAndDelete(id);
    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting destination", error });
  }
};

// 🔍 Search Destinations
const searchDestinations = async (req, res) => {
  try {
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

// 🔄 Toggle Destination Status
const toggleDestinationStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await AdminDestination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const newStatus = destination.status === "Published" ? "Draft" : "Published";
    destination.status = newStatus;
    await destination.save();

    res.status(200).json({ message: `Status changed to ${newStatus}`, destination });
  } catch (error) {
    res.status(500).json({ message: "Error toggling status", error });
  }
};

// 📸 Delete Image from Destination
const deleteImage = async (req, res) => {
  try {
    const { destinationId, imagePath } = req.body;

    // Validate the destination ID
    const destination = await AdminDestination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // Remove the image from the database
    const updatedImages = destination.images.filter(image => image !== imagePath);
    destination.images = updatedImages;

    // Remove the image from the file system
    const filePath = path.join(__dirname, "..", imagePath);
    fs.unlinkSync(filePath);

    // Save the updated destination
    await destination.save();

    res.status(200).json({ message: "Image deleted successfully", destination });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({ message: "Error deleting image", error });
  }
};

// Exporting the controller functions as default export
export default {
  addDestination,
  getDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
  searchDestinations,
  toggleDestinationStatus,
  deleteImage,
};
