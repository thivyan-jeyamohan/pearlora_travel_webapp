import React from 'react';
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
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Booking ID</th>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Room ID</th>
            <th className="border p-2">Check-in Date</th>
            <th className="border p-2">Check-out Date</th>
            <th className="border p-2">Total Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td className="border p-2">{booking._id}</td>
              <td className="border p-2">{booking.userId ? booking.userId.name : 'N/A'}</td>
              <td className="border p-2">{booking.roomId ? booking.roomId.roomNumber : 'N/A'}</td>
              <td className="border p-2">{new Date(booking.checkInDate).toLocaleDateString()}</td>
              <td className="border p-2">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
              <td className="border p-2">{booking.totalPrice}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(booking._id)} className="p-2 bg-red-500 text-white">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;