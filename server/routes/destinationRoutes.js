import express from "express";
import { getDestinationWithWeather } from "../controllers/destinationController.js";

const router = express.Router();

// Route to get a destination with weather details
router.get("/destination/:id", getDestinationWithWeather);  // Fetch destination with weather data

export default router;
