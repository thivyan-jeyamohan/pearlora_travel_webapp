import React, { useState, useEffect, useCallback } from 'react';
import BookingTable from './BookingTable';
import BookingUpdateForm from './BookingUpdateForm';
import API from './services/api';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [showBookingForm, setShowBookingForm] = useState(false); 
    const [selectedBooking, setSelectedBooking] = useState(null); 

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

    const handleEdit = (booking) => {
        setSelectedBooking(booking);
        setShowBookingForm(true);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold mb-4">Booking Management</h1>

            <BookingTable
                bookings={bookings}
                fetchBookings={fetchBookings}
                handleEdit={handleEdit} 
            />

            {showBookingForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-white  z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[80vh] overflow-y-auto">
                        <BookingUpdateForm
                            bookingData={selectedBooking}
                            onClose={() => {
                                setShowBookingForm(false);
                                setSelectedBooking(null);
                            }}
                            fetchBookings={fetchBookings}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;