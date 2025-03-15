import express from "express";
import RideBooking from "../models/BasicRideBooking.js";

const router = express.Router();

router.post("/book-ride", async (req, res) => {
  const { pickupLocation, email, passengerCount, selectedDate, selectedTime, vehicleType } = req.body;

  try {
    const newBooking = new RideBooking({
      pickupLocation,
      email,
      passengerCount,
      selectedDate,
      selectedTime,
      vehicleType
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save booking", error });
  }
});

export default router;
