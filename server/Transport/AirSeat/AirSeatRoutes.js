import express from "express";
const router = express.Router();

import {
  addAirSeat,
  getAllAirSeats,
  getAirSeatById,
  updateAirSeat,
} from "./AirSeatController.js";


router.post("/", addAirSeat);
router.get("/", getAllAirSeats);
router.get("/:id", getAirSeatById);
router.put("/:id", updateAirSeat);


router.get("/:travelId", getAirSeatById);


router.put("/update/:travelId", updateAirSeat);

export default router;
