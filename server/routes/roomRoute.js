// routes/roomRoutes.js
import express from "express";
import { createRoom, getRooms, getRoomById, updateRoom, deleteRoom, checkRoomAvailability } from "../controllers/roomController.js";
const router = express.Router();

// Create a new room
router.post("/", createRoom);  

// Get all rooms (optionally filtered by hotelId)
router.get("/", getRooms);

// Get a single room by ID
router.get("/:id", getRoomById);

// Update room details
router.put("/:id", updateRoom);

// Delete a room
router.delete("/:id", deleteRoom);

 // Check room availability
router.post('/check-availability', checkRoomAvailability);

export default router;