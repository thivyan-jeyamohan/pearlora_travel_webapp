import express from "express";
import RideBooking from "./BasicRideBooking.js";

const router = express.Router();

router.post("/book-ride", async (req, res) => {
  const newBooking = new RideBooking(req.body);
  await newBooking.save();
  res.status(201).json({ message: "Booking successful!" });
});

export default router;
