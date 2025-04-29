import React, { useState, useEffect } from 'react';
import API from './services/api';
import moment from 'moment-timezone';

const BookingUpdateForm = ({ bookingData, onClose, fetchBookings }) => {
    const [booking, setBooking] = useState({
        checkInDate: '',
        checkOutDate: '',
        totalPrice: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
    });

    useEffect(() => {
        if (bookingData) {
            const formattedCheckInDate = moment.utc(bookingData.checkInDate).format('YYYY-MM-DD');
            const formattedCheckOutDate = moment.utc(bookingData.checkOutDate).format('YYYY-MM-DD');

            setBooking({
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                totalPrice: bookingData.totalPrice,
                firstName: bookingData.firstName,
                lastName: bookingData.lastName,
                email: bookingData.email,
                phone: bookingData.phone,
                specialRequests: bookingData.specialRequests || '', 
            });
        }
    }, [bookingData]);

    const handleChange = (e) => {
        setBooking({ ...booking, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/bookings/${bookingData._id}`, booking);
            alert('Booking updated successfully!');
            onClose(); 
            fetchBookings();
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Error updating booking.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Update Booking</h2>
            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4">
                    <label htmlFor="checkInDate" className="block text-gray-700 text-sm font-bold mb-2">Check-in Date:</label>
                    <input
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={booking.checkInDate}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="checkOutDate" className="block text-gray-700 text-sm font-bold mb-2">Check-out Date:</label>
                    <input
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={booking.checkOutDate}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="totalPrice" className="block text-gray-700 text-sm font-bold mb-2">Total Price:</label>
                    <input
                        type="number"
                        id="totalPrice"
                        name="totalPrice"
                        value={booking.totalPrice}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={booking.firstName}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={booking.lastName}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={booking.email}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={booking.phone}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="specialRequests" className="block text-gray-700 text-sm font-bold mb-2">Special Requests:</label>
                    <textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={booking.specialRequests}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Cancel
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Update Booking
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingUpdateForm;