import React from 'react';
import { Edit, Trash } from 'lucide-react';
import API from './services/api';

const HotelTable = ({ hotels, fetchHotels, onEdit }) => {

  const handleDelete = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await API.delete(`/hotels/${hotelId}`);
        fetchHotels();
      } catch (error) {
        console.error('Error deleting hotel:', error);
      }
    } else {
      console.log("Deletion cancelled by user.");
    }
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-md bg-white">
        <thead className="bg-gray-300 text-gray-800 text-sm font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">Hotel ID</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Availability</th>
            <th className="px-4 py-3 text-left">Rating</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-xs md:text-sm">
          {hotels.map((hotel) => (
            <tr key={hotel._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">{hotel.hotelId}</td>
              <td className="px-4 py-3 whitespace-nowrap">{hotel.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">{hotel.location}</td>
              <td className="px-4 py-3 whitespace-nowrap">LKR {hotel.price}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${hotel.availabilityStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {hotel.availabilityStatus ? 'Available' : 'Booked'}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{hotel.rating}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => onEdit(hotel)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelTable;
