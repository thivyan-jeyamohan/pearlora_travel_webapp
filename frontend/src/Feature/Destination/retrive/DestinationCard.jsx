import React from "react";
import { useNavigate } from "react-router-dom";

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {/* First Image */}
      <img
        src={`http://localhost:5000/uploads/${destination.images[0]}`}
        alt={destination.name}
        className="w-full h-56 object-cover rounded-md"
      />

      {/* Destination Name */}
      <h3 className="text-xl font-bold mt-2 text-blue-500">{destination.name}</h3>

      {/* Location */}
      <p className="text-gray-600">{destination.location}</p>

      {/* Prices */}
      <div className="text-lg font-bold mt-2">
        <span className="line-through text-gray-400 mr-2">${destination.price}</span>
        <span className="text-red-500">
          ${destination.price - (destination.price * destination.discount) / 100}
        </span>
      </div>

      {/* Read More Button */}
      <button
        onClick={() => navigate(`/destination/${destination._id}`)}
        className="mt-4 text-blue-500"
      >
        Read More
      </button>
    </div>
  );
};

export default DestinationCard;
