import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import SeatBooking from "./SeatModel";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(`${process.env.MONGO_URI}pearlora`)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Fetch seats for a flight
app.get("/api/seats/:flightId", async (req, res) => {
  const { flightId } = req.params;
  
  try {
    const seatData = await SeatBooking.findOne({ flightId });
    res.json(seatData || { flightId, bookedSeats: [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching seats" });
  }
});

// Book seats
app.post("/api/book", async (req, res) => {
  const { flightId, selectedSeats } = req.body;

  try {
    let seatData = await SeatBooking.findOne({ flightId });

    if (seatData) {
      seatData.bookedSeats = [...seatData.bookedSeats, ...selectedSeats];
    } else {
      seatData = new SeatBooking({ flightId, bookedSeats: selectedSeats });
    }

    await seatData.save();
    res.json({ message: "Seats booked successfully", bookedSeats: seatData.bookedSeats });
  } catch (err) {
    res.status(500).json({ message: "Error booking seats" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
