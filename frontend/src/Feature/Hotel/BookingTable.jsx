import React from 'react';
import { Trash } from 'lucide-react';
import API from './services/api';
import moment from 'moment-timezone';

const BookingTable = ({ bookings, fetchBookings, rooms }) => {
  const handleDelete = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await API.delete(`/booking/${bookingId}`);
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    } else {
      console.log("Deletion cancelled by user.");
    }
  };

  const formatRoomIds = (roomIds) => {
    if (!roomIds || roomIds.length === 0) {
      return 'N/A';
    }

    const roomNumbers = roomIds
      .map((roomId) => {
        const room = rooms.find((r) => r._id === roomId);
        return room ? room.roomNumber : null;
      })
      .filter((roomNumber) => roomNumber !== null);

    return roomNumbers.length > 0 ? roomNumbers.join(', ') : 'N/A';
  };

  return (
    <div className="mt-6 overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-[800px] w-full border-collapse bg-white">
      <thead className="bg-gray-300 text-gray-800 text-sm font-semibold">
          <tr>
            <th className="border-b px-4 py-3 text-left whitespace-nowrap">Booking ID</th>
            <th className="border-b px-4 py-3 text-left whitespace-nowrap">User Email</th>
            <th className="border-b px-4 py-3 text-left whitespace-nowrap">Room Numbers</th>
            <th className="border-b px-4 py-3 text-left whitespace-nowrap">Check-in Date</th>
            <th className="border-b px-4 py-3 text-left whitespace-nowrap">Check-out Date</th>
            <th className="border-b px-4 py-3 text-left whitespace-nowrap">Total Price</th>
            <th className="border-b px-4 py-3 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-xs sm:text-sm">
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-gray-50">
              <td className="border-b px-4 py-3">{booking.bookingId}</td>
              <td className="border-b px-4 py-3 break-words">{booking.email || 'N/A'}</td>
              <td className="border-b px-4 py-3">{formatRoomIds(booking.allRoomIds)}</td>
              <td className="border-b px-4 py-3">
                {moment.utc(booking.checkInDate).format('YYYY-MM-DD')}
              </td>
              <td className="border-b px-4 py-3">
                {moment.utc(booking.checkOutDate).format('YYYY-MM-DD')}
              </td>
              <td className="border-b px-4 py-3">LKR {booking.totalPrice}</td>
              <td className="border-b px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-500 transition-colors"
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

export default BookingTable;
