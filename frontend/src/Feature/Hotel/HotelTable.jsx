import React from 'react';
import { Edit, Trash } from 'lucide-react';
import API from './services/api';

const HotelTable = ({ hotels, setShowHotelForm, setSelectedHotel, fetchHotels }) => {
  const handleEdit = (hotel) => {
    setSelectedHotel(hotel);
    setShowHotelForm(true);
  };

  const handleDelete = async (hotelId) => {
    try {
      await API.delete(`/hotels/${hotelId}`);
      fetchHotels(); 
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full border-collapse table-auto rounded-lg shadow-lg bg-white">
        <thead className="bg-gray-100 text-gray-800 text-sm font-semibold">
          <tr>
            <th className="border-b px-4 py-3 text-left w-[15%]">Hotel ID</th>
            <th className="border-b px-4 py-3 text-left w-[20%]">Hotel Name</th>
            <th className="border-b px-4 py-3 text-left w-[20%]">Location</th>
            <th className="border-b px-4 py-3 text-left w-[10%]">Price</th>
            <th className="border-b px-4 py-3 text-left w-[10%]">Status</th>
            <th className="border-b px-4 py-3 text-left w-[8%]">Rating</th>
            <th className="border-b px-4 py-3 text-left w-[12%]">Cover Photo</th>
            <th className="border-b px-4 py-3 text-center w-[8%]">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {hotels.map((hotel) => (
            <tr key={hotel._id} className="hover:bg-gray-50">
              <td className="border-b px-4 py-3 align-middle">{hotel.hotelId}</td>
              <td className="border-b px-4 py-3 align-middle">{hotel.name}</td>
              <td className="border-b px-4 py-3 align-middle">{hotel.location}</td>
              <td className="border-b px-4 py-3 align-middle">Rs {hotel.price}</td>
              <td className="border-b px-4 py-3 align-middle">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    hotel.availabilityStatus ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {hotel.availabilityStatus ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td className="border-b px-4 py-3 align-middle">{hotel.rating}</td>
              <td className="border-b px-4 py-3 align-middle">
                <img
                  src={hotel.coverPhoto}
                  alt="Cover"
                  className="w-16 h-16 object-cover rounded-md shadow-sm"
                />
              </td>
              <td className="border-b px-4 py-3 align-middle text-center">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handleEdit(hotel)}
                    className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full text-yellow-500"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-500"
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
