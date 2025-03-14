import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import Routes
import userRoutes from "./routes/userRoutes.js";
//import destinationRoutes from "./routes/destinationRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";
//import hotelRoutes from "./routes/hotelRoutes.js";
//import eventRoutes from "./routes/eventRoutes.js";
//import financeRoutes from "./routes/financeRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors()); // Enable CORS

// Database Connection
connectDB();

// Define Routes
app.use("/api/users", userRoutes);
//app.use("/api/destinations", destinationRoutes);
app.use("/api/transport", transportRoutes);
//app.use("/api/hotels", hotelRoutes);
//app.use("/api/events", eventRoutes);
//app.use("/api/finance", financeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
