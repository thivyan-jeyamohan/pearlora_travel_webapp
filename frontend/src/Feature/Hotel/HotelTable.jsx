import React from 'react';
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
    <div className="mt-6">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Hotel ID</th>
            <th className="border p-2">Hotel Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Cover Photo</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel._id}>
              <td className="border p-2">{hotel.hotelId}</td>
              <td className="border p-2">{hotel.name}</td>
              <td className="border p-2">{hotel.location}</td>
              <td className="border p-2">{hotel.price}</td>
              <td className="border p-2">{hotel.availabilityStatus ? "Available" : "Unavailable"}</td>
              <td className="border p-2">{hotel.rating}</td>
              <td className="border p-2">{hotel.description}</td>
              <td className="border p-2">
                <img src={hotel.coverPhoto} alt="Cover" className="w-16 h-16 object-cover" />
              </td>
              <td className="border p-2">
                <button onClick={() => handleEdit(hotel)} className="p-2 bg-yellow-500 text-white mr-2">Edit</button>
                <button onClick={() => handleDelete(hotel._id)} className="p-2 bg-red-500 text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelTable;