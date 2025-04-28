import express from "express";
import {
  createRideBooking,
  getRideBookings,
  deleteRideBooking,
  updateRideBooking,
} from "./transportController.js";

const router = express.Router();

router.post("/book-ride", createRideBooking);
router.get("/ridebookings", getRideBookings);
router.delete("/ridebookings/:id", deleteRideBooking);
router.put("/ridebookings/:id", updateRideBooking);

export default router;
