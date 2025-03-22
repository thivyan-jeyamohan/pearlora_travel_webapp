import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import hotelRoutes from "./routes/hotelRoute.js"; 
// import roomRoutes from "./routes/roomRoutes.js";
// import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json({ limit: '10mb' })); // Enable JSON parsing with increased limit. Adjust as needed.  Important for Base64
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Also increase urlencoded limit


// Database Connection
connectDB();

// Define Routes
// app.use("/api/users", userRoutes);
// app.use("/api/destinations", destinationRoutes);
// app.use("/api/transport", transportRoutes);

app.use("/api/hotels", hotelRoutes); // Use the correct route
// app.use("/api/rooms", roomRoutes);
// app.use("/api/bookings", bookingRoutes);

// app.use("/api/events", eventRoutes);
// app.use("/api/finance", financeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
