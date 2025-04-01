import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import backgroundImage from "../image/traveling-concept-with-landmarks.jpg";



const DestinationDetails = () => {
  const { id } = useParams(); // Get the destination ID from the URL
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        // Fetch destination details using the id from the URL
        const response = await axios.get(
          `http://localhost:5000/api/admin-destinations/${id}`
        );
        setDestination(response.data);
      } catch (error) {
        console.error("Error fetching destination details:", error);
        setError("Error fetching destination details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!destination) {
    return <p className="text-center text-gray-500">No destination found.</p>;
  }

  return (
    <div
      className="relative bg-cover bg-center min-h-screen p-6 text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative container mx-auto p-6 md:px-12 md:py-16 bg-white bg-opacity-80 shadow-lg rounded-lg max-w-4xl">
        <h1 className="text-5xl font-bold text-center text-white mb-6">{destination.name}</h1>

        {/* Show First Image */}
        {destination.images && destination.images.length > 0 && (
          <img
            src={`http://localhost:5000${destination.images[0]}`}
            alt={destination.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out hover:scale-105 mb-6"
          />
        )}

        {/* Show Additional Images */}
        {destination.images && destination.images.length > 1 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
            {destination.images.slice(1).map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000${img}`}
                alt={`${destination.name} additional ${index + 1}`}
                className="w-full h-56 object-cover rounded-lg shadow-sm transform transition-transform duration-500 ease-in-out hover:scale-105"
              />
            ))}
          </div>
        )}

        {/* Description */}
        <div className="mt-8 text-lg text-gray-800">
          <p>{destination.description}</p>
        </div>

        {/* Pricing */}
        <div className="mt-8 flex justify-between items-center text-gray-900">
          <span className="text-3xl font-extrabold">Price: ${destination.price}</span>
          {destination.discount > 0 && (
            <div className="flex items-center">
              <span className="text-lg font-semibold text-red-500 mr-2">Discount: {destination.discount}%</span>
              <span className="text-lg font-semibold text-gray-400 line-through">${destination.price}</span>
            </div>
          )}
        </div>

        {/* Booking Button */}
        <div className="mt-8 flex justify-center">
          <Link to="/booking/form">
            <button className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
