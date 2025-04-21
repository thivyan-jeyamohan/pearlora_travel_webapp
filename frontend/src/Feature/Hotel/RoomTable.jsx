import React from 'react';
import { Edit, Trash } from 'lucide-react';
import API from './services/api';

const RoomTable = ({ rooms, fetchRooms, hotels, onEdit }) => {  
  const getHotelName = (hotelId) => {
    const hotel = hotels.find((h) => h._id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
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
      <table className="min-w-full border-collapse table-auto rounded-lg shadow-lg bg-white">
        <thead className="bg-gray-300 text-gray-800 text-sm font-semibold">
          <tr>
            <th className="border-b px-4 py-3 text-left w-[20%]">Hotel ID</th>
            <th className="border-b px-4 py-3 text-left w-[15%]">Hotel Name</th>
            <th className="border-b px-4 py-3 text-left w-[10%]">Room Number</th>
            <th className="border-b px-4 py-3 text-left w-[15%]">Photo</th>
            <th className="border-b px-4 py-3 text-left w-[10%]">Price</th>
            <th className="border-b px-4 py-3 text-left w-[12%]">Room Category</th>
            <th className="border-b px-4 py-3 text-left w-[10%]">Room Status</th>
            <th className="border-b px-4 py-3 text-center w-[8%]">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {rooms.map((room) => (
            <tr key={room._id} className="hover:bg-gray-50">
              <td className="border-b px-4 py-3 align-middle">{room.hotelId}</td>
              <td className="border-b px-4 py-3 align-middle">{getHotelName(room.hotelId)}</td>
              <td className="border-b px-4 py-3 align-middle">{room.roomNumber}</td>
              <td className="border-b px-4 py-3 align-middle">
                <img
                  src={room.photo}
                  alt="Room"
                  className="w-14 h-14 object-cover rounded-md shadow-sm"
                />
              </td>
              <td className="border-b px-4 py-3 align-middle">Rs {room.price}</td>
              <td className="border-b px-4 py-3 align-middle truncate">{room.roomCategory}</td>
              <td className="border-b px-4 py-3 align-middle">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${room.isBooked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}
                >
                  {room.isBooked ? 'Booked' : 'Available'}
                </span>
              </td>
              <td className="border-b px-4 py-3 align-middle text-center">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => onEdit(room)}  
                    className="p-2 bg-blue-200 hover:bg-blue-300 rounded-full text-blue-500"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="p-2 bg-red-200 hover:bg-red-300 rounded-full text-red-500"
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