import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import rideBookingRoute from "./Transport/User/BasicRide/BasicRideBookingRoute.js";
import airTaxiTravelRoutes from "./Transport/Admin/Travel/AirTaxiTravelRoutes.js";
import authRoutes from "./User/User.js";




dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Connecting MongoDB
mongoose
  .connect(`${process.env.MONGO_URI}pearlora`)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/rides", rideBookingRoute);
app.use("/api/travels", airTaxiTravelRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
