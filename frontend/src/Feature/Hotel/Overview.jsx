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
    <div>
      <h1 className="text-3xl font-semibold mb-5 ml-12 ">Overview</h1>
      <p className="ml-12">Welcome to the hotel management dashboard. Here you can manage Hotels, Rooms & Bookings.</p>

      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hotels.length > 0 ? (
                    hotels.map((hotel) => (
                        <div key={hotel._id} className="bg-white rounded-lg mb-20 shadow-lg overflow-hidden flex flex-col h-[22rem]">
                            <img src={hotel.coverPhoto} alt={hotel.name} className="w-full h-40 object-cover" />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-700">{hotel.name}</h3>
                                <div className="text-gray-600 text-sm flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-gray-500" /> {hotel.location}
                                </div>
                                <p className="text-gray-700 font-semibold">Rs {hotel.price} / night</p>
                                <p className="text-gray-500 text-sm">⭐ {hotel.rating} / 5</p>
                                <Link
                                    to={`/hotel/${hotel._id}`}
                                    className="mt-auto bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 text-center"
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