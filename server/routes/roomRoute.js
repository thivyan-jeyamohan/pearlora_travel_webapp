import express from "express";
import { createRoom, getRoomsByHotel, getRoomById, updateRoom, deleteRoom } from "../controllers/roomController";

const router = express.Router();

// Create a new room for a specific hotel
router.post("/", createRoom);

// Get all rooms for a specific hotel
router.get("/hotel/:hotelId", getRoomsByHotel);

// Get a single room by ID
router.get("/:id", getRoomById);

// Update room details
router.put("/:id", updateRoom);

// +Delete a room
router.delete("/:id", deleteRoom);

module.exports = router;
