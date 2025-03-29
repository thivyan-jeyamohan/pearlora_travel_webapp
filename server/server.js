import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import hotelRoutes from "./routes/hotelRoute.js"; 
import roomRoutes from "./routes/roomRoute.js";
import bookingRoutes from "./routes/bookingRoute.js";
import reportRoute from "./routes/reportRoute.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true })); 


// Database Connection
connectDB();

// Define Routes
// app.use("/api/users", userRoutes);
// app.use("/api/destinations", destinationRoutes);
// app.use("/api/transport", transportRoutes);

app.use("/api/hotels", hotelRoutes); 
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reports", reportRoute);

// app.use("/api/events", eventRoutes);
// app.use("/api/finance", financeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
