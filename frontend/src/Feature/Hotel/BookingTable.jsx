import React from 'react';
import { Trash } from 'lucide-react'; 
import API from './services/api';

const BookingTable = ({ bookings, fetchBookings }) => {
  const handleDelete = async (bookingId) => {
    try {
      await API.delete(`/bookings/${bookingId}`);
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full border-collapse table-auto rounded-lg shadow-lg bg-white">
        <thead className="bg-gray-100 text-gray-800 text-sm font-semibold">
          <tr>
            <th className="border-b px-4 py-3 text-left">Booking ID</th>
            <th className="border-b px-4 py-3 text-left">User ID</th>
            <th className="border-b px-4 py-3 text-left">Room ID</th>
            <th className="border-b px-4 py-3 text-left">Check-in Date</th>
            <th className="border-b px-4 py-3 text-left">Check-out Date</th>
            <th className="border-b px-4 py-3 text-left">Total Price</th>
            <th className="border-b px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-gray-50">
              <td className="border-b px-4 py-3">{booking._id}</td>
              <td className="border-b px-4 py-3">{booking.userId || 'N/A'}</td>
              <td className="border-b px-4 py-3">{booking.roomId || 'N/A'}</td>
              <td className="border-b px-4 py-3">
                {new Date(booking.checkInDate).toLocaleDateString()}
              </td>
              <td className="border-b px-4 py-3">
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </td>
              <td className="border-b px-4 py-3">{booking.totalPrice}</td>
              <td className="border-b px-4 py-3 text-center">
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-500"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
