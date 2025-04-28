import express from "express";

import {
  addTravel,
  getAllTravels,
  getTravelById,
  updateTravel,
  deleteTravel,
} from "./AirTaxiTravelController.js";

const router = express.Router();

router.post("/", addTravel);
router.get("/", getAllTravels);
router.get("/:id", getTravelById);
router.put("/:id", updateTravel);
router.delete("/:id", deleteTravel);

export default router;
