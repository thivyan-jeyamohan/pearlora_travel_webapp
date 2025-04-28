import express from 'express';
import { getWeather } from '../controllers/weatherController.js';  // Ensure the path is correct

const router = express.Router();

// Weather API route
router.post('/', getWeather);

export default router;  // Export the router
