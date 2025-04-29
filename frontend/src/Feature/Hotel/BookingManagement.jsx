import React, { useState, useEffect, useCallback } from 'react';
import BookingTable from './BookingTable';
import BookingUpdateForm from './BookingUpdateForm';
import API from './services/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      const response = await API.get('/booking');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, []);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      const response = await API.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, [fetchBookings, fetchRooms]);

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowBookingForm(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Booking Management</h1>

      <div className="overflow-x-auto">
        <BookingTable
          bookings={bookings}
          fetchBookings={fetchBookings}
          handleEdit={handleEdit}
          rooms={rooms}
        />
      </div>

      {showBookingForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <BookingUpdateForm
                bookingData={selectedBooking}
                onClose={() => {
                  setShowBookingForm(false);
                  setSelectedBooking(null);
                }}
                fetchBookings={fetchBookings}
                rooms={rooms}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
