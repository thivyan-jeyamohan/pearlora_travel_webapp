import express from "express";
import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import connectDB from "./config/db.js";

import hotelRoutes from "./routes/hotelRoute.js"; 
import roomRoutes from "./routes/roomRoute.js";
import bookingRoutes from "./routes/bookingRoute.js";
import reportRoute from "./routes/reportRoute.js";
import chatbotRoutes from './routes/chatbotRoutes.js';
import { startScheduledTasks } from "./controllers/backgroundTasks.js";

import authRoutes from "./User/authRoutes.js";
import userRoutes from "./User/userRoutes.js";
import { protect } from "./middleware/authMiddleware.js";


dotenv.config();

const app = express();

app.use((req, res, next) => {
  let rawBody = '';
  req.on('data', chunk => {
    rawBody += chunk.toString();
  });
  req.on('end', () => {
    console.log("Raw request body:", rawBody);
    req.rawBody = rawBody; // Store for later use if needed
  });
  next();
});


// Middleware
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true })); 


// Database Connection
connectDB();

// Define Routes

// app.use("/api/destinations", destinationRoutes);
// app.use("/api/transport", transportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

startScheduledTasks();
app.use("/api/hotels", hotelRoutes); 
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reports", reportRoute);
app.use('/api/chatbot', chatbotRoutes);

// app.use("/api/events", eventRoutes);
// app.use("/api/finance", financeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
