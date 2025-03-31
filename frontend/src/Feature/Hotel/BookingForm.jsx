import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from './services/api';
import moment from 'moment-timezone'; 

const BookingForm = () => {
    const { hotelId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [userId, setUserId] = useState("65b5a38efbd544a87204b73a");
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedRoomDetails, setSelectedRoomDetails] = useState([]);
    const [availabilityMessage, setAvailabilityMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const checkIn = params.get('checkInDate');
        const checkOut = params.get('checkOutDate');
        const roomIds = params.get('roomIds')?.split(',') || [];

        setCheckInDate(checkIn);
        setCheckOutDate(checkOut);
        setSelectedRooms(roomIds);

        const fetchRoomDetails = async () => {
            try {
                const roomDetails = await Promise.all(
                    roomIds.map(roomId => API.get(`/rooms/${roomId}`).then(res => res.data))
                );
                setSelectedRoomDetails(roomDetails);

                // Calculate total price
                const startDate = moment(checkIn);
                const endDate = moment(checkOut);
                const numberOfDays = endDate.diff(startDate, 'days');
                const newTotalPrice = roomDetails.reduce((acc, room) => acc + room.price * numberOfDays, 0);
                setTotalPrice(newTotalPrice);

            } catch (error) {
                console.error("Error fetching room details:", error);
                setAvailabilityMessage("Error fetching room details. Please try again.");
            }
        };

        if (roomIds.length > 0) {
            fetchRoomDetails();
        }
    }, [location.search]);

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
            const sriLankaTimezone = 'Asia/Colombo'; 
            const timezoneOffsetMinutes = moment.tz(sriLankaTimezone).utcOffset();

            const sriLankaTime = moment(date).utcOffset(timezoneOffsetMinutes);
            return sriLankaTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        };

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

            if (response.status === 201) {
                window.alert("Booking successful! Details have been sent to your email.");
                console.log("Booking Successful - Resetting Form");
                setAvailabilityMessage("Booking successful!");
                navigate(`/hotel/${hotelId}`); 

            } else {
                setAvailabilityMessage("Failed to book. Please check details and try again.");
            }
        } catch (error) {
            console.error("Error booking rooms:", error);
            setAvailabilityMessage(error.response?.data?.message || "Failed to book. Please check details and try again.");
        }
    };

    const handleCancelBooking = () => {
        navigate(`/hotel/${hotelId}`);
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
        <div className="font-sans bg-gray-100 min-h-screen mt-14 py-12">
            <div className="container mx-auto px-4 w-150">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enter Your Details</h2>
                    {selectedRoomDetails && selectedRoomDetails.length > 0 && (
                        <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Selected Rooms:</h3>
                        <div className="flex flex-row overflow-x-auto space-x-4"> 
                            {selectedRoomDetails.map(room => (
                                <div key={room._id} className="flex-none w-64"> 
                                    <div className="mb-2">
                                        {room.roomNumber} ({room.roomCategory}) - Rs {room.price} per night
                                    </div>
                                    <img
                                        src={room.photo}
                                        alt={room.roomNumber}
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-center mt-4">
                            <span className="font-bold text-black">Total Price: </span>
                            <span className="text-green-500"> Rs {totalPrice}</span>
                        </p>
                    </div>

                    )}
                    {availabilityMessage && (
                        <p className="text-center text-gray-700 mb-4">{availabilityMessage}</p>
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
                </div>
            </div>
        </div>
    );
};

export default BookingForm;