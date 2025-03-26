// bookingRoute.js
import express from "express";
import { bookRoom, getAllBookings, cancelBooking } from "../controllers/hotelBookingController.js";

const router = express.Router();

router.post("/", bookRoom); 

router.get("/", getAllBookings);
router.delete("/:id", cancelBooking);

export default router;