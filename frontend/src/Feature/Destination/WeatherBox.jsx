import React, { useState } from 'react';
import axios from 'axios';

const WeatherBox = () => {
    const [showBox, setShowBox] = useState(false);
    const [destination, setDestination] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');

    // Toggle the visibility of the box
    const handleWeatherClick = () => {
        setShowBox((prevShowBox) => !prevShowBox);
    };

    // Handle weather search when the user clicks the search button
    const handleSearchWeather = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/weather', { destination });
            setWeatherData(response.data);
            setError('');
        } catch (err) {
            setError('Weather data not found');
            setWeatherData(null);
        }
    };

    // Close the weather box
    const handleCloseBox = () => {
        setShowBox(false);
    };

    return (
        <div className="relative">
            {/* Weather Button - Positioned at the top */}
            <button
                onClick={handleWeatherClick}
                className="absolute top-1 left-1/2 transform -translate-x-1/2 px-3 py-3 bg-blue-600 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
                Check Weather
            </button>

            {/* Weather Info Box */}
            {showBox && (
                <div
                    className="fixed top-20 left-1/2 transform -translate-x-1/2 p-6 bg-white border rounded-lg shadow-lg w-80 z-50"
                    style={{ zIndex: 9999 }} // Ensuring it is on top of other components
                >
                    <h3 className="text-lg font-semibold mb-4">Check the Weather</h3>
                    <button
                        onClick={handleCloseBox}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                        &#x2715; {/* Close Icon (X) */}
                    </button>
                    <input
                        type="text"
                        placeholder="Enter Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                    <button
                        onClick={handleSearchWeather}
                        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
                    >
                        Search
                    </button>

                    {/* Display Weather Data */}
                    {weatherData && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-700">Temperature: {weatherData.main.temp}°C</p>
                            <p className="text-sm text-gray-700">Weather: {weatherData.weather[0].description}</p>
                            <p className="text-sm text-gray-700">Humidity: {weatherData.main.humidity}%</p>
                        </div>
                    )}

                    {/* Display Error */}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default WeatherBox;
