import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import rideBookingRoutes from "./Transport/User/BasicRide/BasicRideBookingRoute.js";
import airTaxiTravelRoutes from "./Transport/Admin/Travel/AirTaxiTravelRoutes.js";
import authRoutes from "./User/authRoutes.js";
import airSeatRoutes from "./Transport/AirSeat/AirSeatRoutes.js";
import userRoutes from "./User/userRoutes.js";
import vehicleRoutes from './Transport/Vehicle/vehicleRoutes.js';
import flightBookingRoutes from './Transport/User/FlightBooking/FlightBookingRoute.js';

import path from "path";  
import bookingRoutes from "./routes/bookingRoutes.js";  // Added .js extension
import destinationRoutes from "./routes/destinationRoutes.js";  // Added .js extension
import adminDestinationRoutes from "./routes/adminDestinationRoutes.js";  // Added .js extension
import weatherRoutes from "./routes/weatherRoutes.js";  // Added .js extension

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();


// Middleware
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


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideBookingRoutes);
app.use("/api/airtaxitravels", airTaxiTravelRoutes);
app.use("/api/airseats", airSeatRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/bookings", bookingRoutes);
app.use("/api", destinationRoutes);
app.use("/api/admin-destinations", adminDestinationRoutes);
app.use('/api/weather', weatherRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/flightbooking', flightBookingRoutes);


// Error handler
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
