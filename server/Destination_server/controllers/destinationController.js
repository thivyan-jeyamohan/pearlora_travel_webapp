// controllers/destinationController.js
const Destination = require("../models/Destination");
const axios = require("axios");

// Function to get weather data for a specific location
const getWeatherData = async (lat, lon) => {
  const apiKey = '4b356ca570f6960f7d019494a46d28bb'; // Replace with your actual API key
  try {
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric'  // Celsius temperature
      }
    });
    return weatherResponse.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
};

// Get a destination with its weather data
exports.getDestinationWithWeather = async (req, res) => {
  try {
    const { id } = req.params; // Get the destination ID from the route params
    const destination = await Destination.findById(id); // Fetch the destination from the DB

    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    // Fetch weather data based on the latitude and longitude of the destination
    const weatherData = await getWeatherData(destination.latitude, destination.longitude);

    // Return destination details and weather data
    res.status(200).json({
      success: true,
      destination,
      weather: weatherData,
    });
  } catch (error) {
    console.error("Error in getDestinationWithWeather:", error);
    res.status(500).json({ success: false, message: "Error fetching destination or weather data", error: error.message });
  }
};
