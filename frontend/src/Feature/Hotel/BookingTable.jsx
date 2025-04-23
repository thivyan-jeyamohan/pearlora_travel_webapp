import React from 'react';
import { Trash, Edit } from 'lucide-react';
import API from './services/api';
import moment from 'moment-timezone';

const BookingTable = ({ bookings, fetchBookings,rooms }) => {

    const handleDelete = async (bookingId) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await API.delete(`/bookings/${bookingId}`);
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

        // Retrieve room numbers for each roomId
        const roomNumbers = roomIds.map((roomId) => {
            const room = rooms.find((r) => r._id === roomId);
            return room ? room.roomNumber : null;
        }).filter((roomNumber) => roomNumber !== null);

        return roomNumbers.length > 0 ? roomNumbers.join(', ') : 'N/A';
    };



    return (
        <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-collapse table-auto rounded-lg shadow-lg bg-white">
                <thead className="bg-gray-300 text-gray-800 text-sm font-semibold">
                    <tr>
                        <th className="border-b px-4 py-3 text-left">Booking ID</th>
                        <th className="border-b px-4 py-3 text-left">User Email</th>
                        <th className="border-b px-4 py-3 text-left">Room Numbers</th> 
                        <th className="border-b px-4 py-3 text-left">Check-in Date</th>
                        <th className="border-b px-4 py-3 text-left">Check-out Date</th>
                        <th className="border-b px-4 py-3 text-left">Total Price</th>
                        <th className="border-b px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                    {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="border-b px-4 py-3">{booking.bookingId}</td>
                            <td className="border-b px-4 py-3">{booking.email || 'N/A'}</td>
                            <td className="border-b px-4 py-3">{formatRoomIds(booking.allRoomIds)}</td> 
                            <td className="border-b px-4 py-3">
                                {moment.utc(booking.checkInDate).format('YYYY-MM-DD')}
                            </td>
                            <td className="border-b px-4 py-3">
                                {moment.utc(booking.checkOutDate).format('YYYY-MM-DD')}
                            </td>
                            <td className="border-b px-4 py-3">Rs {booking.totalPrice}</td>
                            <td className="border-b px-4 py-3 text-center">
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => handleDelete(booking._id)}
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

export default BookingTable;