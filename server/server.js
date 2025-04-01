import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import rideBookingRoutes from "./Transport/User/BasicRide/BasicRideBookingRoute.js";
import airTaxiTravelRoutes from "./Transport/Admin/Travel/AirTaxiTravelRoutes.js";
import authRoutes from "./User/authRoutes.js";
import airSeatRoutes from "./Transport/AirSeat/AirSeatRoutes.js";
import userRoutes from "./User/userRoutes.js";
dotenv.config();

const app = express();


app.use((req, res, next) => {
  let rawBody = "";
  req.on("data", (chunk) => {
    rawBody += chunk.toString();
  });
  req.on("end", () => {
    console.log("Raw request body:", rawBody);
    req.rawBody = rawBody; 
  });
  next();
});

app.use(cors());
app.use(express.json()); 

mongoose
  .connect(`${process.env.MONGO_URI}pearlora`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideBookingRoutes);
app.use("/api/airtaxitravels", airTaxiTravelRoutes);
app.use("/api/airseats", airSeatRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
