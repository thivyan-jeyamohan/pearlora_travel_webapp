// bookingRoute.js
import express from "express";
import { bookRoom, getAllBookings, cancelBooking,updateBooking } from "../controllers/hotelBookingController.js";

const router = express.Router();

router.post("/", bookRoom); 

router.get("/", getAllBookings);

router.delete("/:id", cancelBooking);

router.put("/:id", updateBooking);

export default router;