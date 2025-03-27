import React, { useState, useEffect } from 'react';
import API from './services/api';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const BookingForm = ({hotelId,checkInDate,setCheckInDate,checkOutDate,setCheckOutDate,availableRooms,selectedRooms,handleRoomToggle,isLoading,availabilityMessage,handleShowBookingForm,selectedRoomDetails,totalPrice,handleBookingSuccess,setAvailabilityMessage,setSelectedRooms, setTotalPrice,setShowBookingForm,setCheckInDate: setCheckInDateProp, setCheckOutDate: setCheckOutDateProp, setAvailableRooms, setSelectedRoomDetails,onCheckRoomAvailability
}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [checkInDateError, setCheckInDateError] = useState('');
    const [checkOutDateError, setCheckOutDateError] = useState('');
    const [userId, setUserId] = useState("65b5a38efbd544a87204b73a");

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]*$/;
        return nameRegex.test(name);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z][\w.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^(077|071|074|075|076)[0-9]{7}$/;
        return phoneRegex.test(phone);
    };

    const formatDateForAPI = (date) => {
        return moment(date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    };

    useEffect(() => {
        if (checkInDate) {
            const checkIn = moment(checkInDate);

            if (!checkIn.isValid()) {
                setCheckInDateError("Invalid date format.");
            } else if (checkIn.isBefore(moment(), 'day')) {
                setCheckInDateError("Check-in date cannot be in the past.");
            } else {
                setCheckInDateError("");
            }
        }
    }, [checkInDate]); 

    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const checkIn = moment(checkInDate);
            const checkOut = moment(checkOutDate);

            if (!checkIn.isValid() || !checkOut.isValid()) {
                setCheckInDateError("Invalid date format.");
                setCheckOutDateError("Invalid date format.");
            } else if (checkIn.isBefore(moment(), 'day')) {
                setCheckInDateError("Check-in date cannot be in the past.");
                setCheckOutDateError("");
            } else if (checkOut.isSameOrBefore(checkIn, 'day')) {
                setCheckOutDateError("Check-out date must be after check-in date.");
                setCheckInDateError("");
            } else {
                setCheckInDateError("");
                setCheckOutDateError("");
            }
        }
    }, [checkInDate, checkOutDate]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!firstName) {
            setFirstNameError("First name is required.");
            isValid = false;
        } else if (!validateName(firstName)) {
            setFirstNameError("First name cannot contain numbers or symbols.");
            isValid = false;
        } else {
            setFirstNameError("");
        }

        if (!lastName) {
            setLastNameError("Last name is required.");
            isValid = false;
        } else if (!validateName(lastName)) {
            setLastNameError("Last name cannot contain numbers or symbols.");
        } else {
            setLastNameError("");
        }

        if (!email) {
            setEmailError("Email is required.");
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError("Invalid email format.  Must start with a letter.");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!phone) {
            setPhoneError("Phone number is required.");
            isValid = false;
        } else if (!validatePhone(phone)) {
            setPhoneError("Must start with 077, 071, 074, 075, or 076 and be 10 digits.");
        } else {
            setPhoneError("");
        }

        if (!checkInDate) {
            setCheckInDateError("Check-in date is required.");
            isValid = false;
        }
        if (!checkOutDate) {
            setCheckOutDateError("Check-out date is required.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        try {
            const bookingData = {
                userId: userId,
                roomIds: selectedRooms,
                checkInDate: formatDateForAPI(checkInDate),
                checkOutDate: formatDateForAPI(checkOutDate),
                totalPrice: totalPrice,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                specialRequests: specialRequests,
            };

            const response = await API.post('/bookings', bookingData);
            console.log("API Response:", response);

            if (response.status === 201) {
              console.log("Booking Successful - Resetting Form"); 
                setAvailabilityMessage("Booking successful!");
                setSelectedRooms([]);
                setTotalPrice(0);
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setSpecialRequests('');
                setCheckInDateProp('');
                setCheckOutDateProp('');
                setAvailableRooms([]);
                setSelectedRoomDetails(null);

                setShowBookingForm(false); 
                handleBookingSuccess(); 
            } else {
                setAvailabilityMessage("Failed to book. Please check details and try again.");
            }
        } catch (error) {
            console.error("Error booking rooms:", error);
            setAvailabilityMessage(error.response?.data?.message || "Failed to book. Please check details and try again.");
        }
    };

    const handleCheckAvailability = () => {
        if (!checkInDate) {
            setCheckInDateError("Check-in date is required.");
            return;
        } else {
            setCheckInDateError('');
        }

        if (!checkOutDate) {
            setCheckOutDateError("Check-out date is required.");
            return;
        } else {
            setCheckOutDateError('');
        }

        onCheckRoomAvailability(checkInDate, checkOutDate);
    };

    const handleCancelBooking = () => {
        setShowBookingForm(false);
        setAvailabilityMessage("");
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setSpecialRequests('');
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setPhoneError('');
        setCheckInDateError('');
        setCheckOutDateError('');
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        if (!validateName(value)) {
            setFirstNameError("First name cannot contain numbers or symbols.");
        } else {
            setFirstNameError("");
        }
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLastName(value);
        if (!validateName(value)) {
            setLastNameError("Last name cannot contain numbers or symbols.");
        } else {
            setLastNameError("");
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (!validateEmail(value)) {
            setEmailError("Invalid email format.  Must start with a letter.");
        } else {
            setEmailError("");
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);
        if (!validatePhone(value)) {
            setPhoneError("Must start with 077, 071, 074, 075, or 076 and be 10 digits.");
        } else {
            setPhoneError("");
        }
    };

    return (
        <>
            {!hotelId ? (
                <>
                    <div className="mb-4">
                        <label htmlFor="checkInDate" className="block text-gray-700 text-sm font-bold mb-2">
                            Check-in Date:
                            <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                        </label>
                        <input
                            type="date"
                            id="checkInDate"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {checkInDateError && <p className="text-red-500 text-xs italic">{checkInDateError}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="checkOutDate" className="block text-gray-700 text-sm font-bold mb-2">
                            Check-out Date:
                            <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                        </label>
                        <input
                            type="date"
                            id="checkOutDate"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {checkOutDateError && <p className="text-red-500 text-xs italic">{checkOutDateError}</p>}
                    </div>

                    <button
                        onClick={handleCheckAvailability}
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Checking...' : 'Check Availability'}
                    </button>

                    {availabilityMessage && (
                        <p className="text-center text-gray-700 mb-4">{availabilityMessage}</p>
                    )}

                    {availableRooms.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Available Rooms</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {availableRooms.map(room => (
                                    <div key={room._id} className="border rounded p-4">
                                        <p>{room.roomNumber} ({room.roomCategory}) - {room.price}Rs</p>
                                        <img
                                            src={room.photo}
                                            alt={room.roomNumber}
                                            className="w-full h-32 object-cover rounded-md"
                                        />

                                        <label className="flex items-center mt-2 space-x-3">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                                value={room._id}
                                                checked={selectedRooms.includes(room._id)}
                                                onChange={() => handleRoomToggle(room._id)}
                                                disabled={isLoading}
                                            />
                                            <span className="text-gray-700">Select Room</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleShowBookingForm}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-5"
                        disabled={selectedRooms.length === 0 || !checkInDate || !checkOutDate || isLoading}
                    >
                        Book Now
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enter Your Details</h2>
                    {selectedRoomDetails && selectedRoomDetails.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Selected Rooms:</h3>
                            <ul>
                                {selectedRoomDetails.map(room => (
                                    <li key={room._id} className="mb-2">
                                        {room.roomNumber} ({room.roomCategory}) - ${room.price} per night
                                        <img
                                            src={room.photo}
                                            alt={room.roomNumber}
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                    </li>
                                ))}
                            </ul>
                            <p className="text-gray-700">Total Price: ${totalPrice}</p>
                        </div>
                    )}
                    <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={handleFirstNameChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            {firstNameError && <p className="text-red-500 text-xs italic">{firstNameError}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={handleLastNameChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            {lastNameError && <p className="text-red-500 text-xs italic">{lastNameError}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={handlePhoneChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            {phoneError && <p className="text-red-500 text-xs italic">{phoneError}</p>}
                        </div>
                        <div>
                            <label htmlFor="specialRequests" className="block text-gray-700 text-sm font-bold mb-2">Special Requests:</label>
                            <textarea
                                id="specialRequests"
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleCancelBooking}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </form>
                </>
            )}
        </>
    );
};

export default BookingForm;