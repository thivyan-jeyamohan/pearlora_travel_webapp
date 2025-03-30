import express from "express";
const router = express.Router();

import {
  addAirSeat,
  getAllAirSeats,
  getAirSeatById,
  updateAirSeat,
} from "./AirSeatController.js";

// Define routes for AirSeat
router.post("/", addAirSeat);
router.get("/", getAllAirSeats);
router.get("/:id", getAirSeatById);
router.put("/:id", updateAirSeat);

// Get AirSeat by travelId
router.get("/:travelId", getAirSeatById);

// Update AirSeat (book seats)
router.put("/update/:travelId", updateAirSeat);

export default router;
