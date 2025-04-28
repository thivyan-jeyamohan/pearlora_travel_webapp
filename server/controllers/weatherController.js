import axios from 'axios';

// API Key (directly placed here)
const OPENWEATHER_API_KEY = '4b356ca570f6960f7d019494a46d28bb'; // Your OpenWeather API Key

// Get weather for a specific destination
export const getWeather = async (req, res) => {
    const { destination } = req.body;  // Get destination from the request body

    if (!destination) {
        return res.status(400).json({ message: "Please provide a destination" });
    }

    try {
        // Make the API call to OpenWeather
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${OPENWEATHER_API_KEY}&units=metric`);

        // Send the weather data as a response
        return res.json(weatherResponse.data);
    } catch (error) {
        // Handle any errors
        return res.status(500).json({ message: "Error fetching weather data", error: error.message });
    }
};
