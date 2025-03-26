import React, { useState, useEffect, useCallback } from 'react';
import BookingTable from './BookingTable';
import API from './services/api';

const BookingManagement = () => { 
  const [bookings, setBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await API.get('/bookings'); 
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Booking Management</h1>
      <BookingTable bookings={bookings} fetchBookings={fetchBookings} />
    </div>
  );
};

export default BookingManagement;