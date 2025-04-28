import React from 'react';
import { Edit, Trash } from 'lucide-react';
import API from './services/api';

const RoomTable = ({ rooms, fetchRooms, hotels, onEdit }) => {
  const getHotelName = (hotelId) => {
    const hotel = hotels.find((h) => h._id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const getHotelId = (hotelId) => {
    const hotel = hotels.find((h) => h._id === hotelId);
    return hotel ? hotel.hotelId : 'Unknown Hotel';
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await API.delete(`/rooms/${roomId}`);
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
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
            <th className="px-4 py-3 text-left">Hotel Name</th>
            <th className="px-4 py-3 text-left">Room Number</th>
            <th className="px-4 py-3 text-left">Photo</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Room Category</th>
            <th className="px-4 py-3 text-left">Room Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-xs md:text-sm">
          {rooms.map((room) => (
            <tr key={room._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">{getHotelId(room.hotelId)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{getHotelName(room.hotelId)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{room.roomNumber}</td>
              <td className="px-4 py-3">
                <img
                  src={room.photo}
                  alt="Room"
                  className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-md shadow-sm"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">LKR {room.price}</td>
              <td className="px-4 py-3 whitespace-nowrap">{room.roomCategory}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${room.isBooked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}
                >
                  {room.isBooked ? 'Booked' : 'Available'}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => onEdit(room)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
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

export default RoomTable;
