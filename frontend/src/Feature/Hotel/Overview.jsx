import React, { useState, useEffect } from 'react';
import API from './services/api';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa'; 

const Overview = () => {
  const [hotels, setHotels] = useState([]);

  const fetchHotels = async () => {
    try {
      const { data } = await API.get(`/hotels`);
      setHotels(data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Overview</h1>
      <p className="text-gray-600 mb-8">
        Welcome to the hotel management dashboard. Manage Hotels, Rooms & Bookings easily.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div 
              key={hotel._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col min-h-[22rem] transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <img 
                src={hotel.coverPhoto} 
                alt={hotel.name} 
                className="w-full h-40 sm:h-48 object-cover" 
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{hotel.name}</h3>
                <div className="text-gray-600 text-sm flex items-center mb-2">
                  <FaMapMarkerAlt className="mr-2 text-gray-500" /> {hotel.location}
                </div>
                <p className="text-gray-700 font-semibold mb-1">Rs {hotel.price} / night</p>
                <p className="text-gray-500 text-sm mb-3">⭐ {hotel.rating} / 5</p>
                <Link
                  to={`/hotel/${hotel._id}`}
                  className="mt-auto bg-gray-800 text-white py-2 text-sm rounded-md text-center hover:bg-gray-900 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No hotels found.</p>
        )}
      </div>
    </div>
  );
};

export default Overview;
