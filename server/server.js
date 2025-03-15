import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import rideBookingRoute from "./routes/BasicRideBookingRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connecting MongoDB
mongoose
  .connect(`${process.env.MONGO_URI}pearlora`)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/rides", rideBookingRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
