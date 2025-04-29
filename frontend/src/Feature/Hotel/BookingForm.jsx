import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from './services/api';
import moment from 'moment-timezone'; 
import Footer from '../../components/Footer';

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
        // const phoneRegex = /^(077|071|074|075|076)[0-9]{7}$/;
        const phoneRegex = /^[0-9]{10}$/;
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
            isValid = false;
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
            setPhoneError(" Phone number Must be contain 10 digits.");
            isValid = false;
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

            const response = await API.post('/booking', bookingData);

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
            setPhoneError("Phone Number Must be contain 10 digits.");
        } else {
            setPhoneError("");
        }
    };

    return (
      <div className="font-sans bg-gradient-to-br from-blue-500 via-purple-300 to-blue-300 min-h-screen flex flex-col font-['Inter'] pt-16">
        <div className="container mx-auto px-4 py-6 md:py-8 flex-grow flex flex-col items-center justify-center">
          
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Side - Form */}
            <div className="w-full md:w-7/12 p-5 sm:p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-5 text-center">
                Enter Your Details
              </h2>
    
              {/* Selected Rooms */}
              {selectedRoomDetails && selectedRoomDetails.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Selected Rooms:</h3>
                  <div className="flex overflow-x-auto space-x-4 pb-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500">
                    {selectedRoomDetails.map(room => (
                      <div key={room._id} className="flex-none w-40 sm:w-48 bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
                        <img
                          src={room.photo || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Room'}
                          alt={`Room ${room.roomNumber}`}
                          className="w-full h-24 object-cover rounded-md mb-2"
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image')}
                        />
                        <p className="text-sm font-medium text-gray-800">
                          {room.roomNumber} ({room.roomCategory || 'N/A'})
                        </p>
                        <p className="text-xs text-gray-600">
                          LKR {typeof room.price === 'number' ? room.price.toLocaleString() : 'N/A'} / night
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-center mt-4">
                    <span className="font-bold text-gray-800">Total Price: </span>
                    <span className="text-purple-600 font-bold">
                      LKR {typeof totalPrice === 'number' ? totalPrice.toLocaleString() : '0'}
                    </span>
                  </p>
                  <div className="w-full h-1 bg-gray-500 mt-3"></div>
                </div>
              ) : (
                <p className="text-center text-gray-500 mb-4">Loading room details or no rooms selected...</p>
              )}
    
              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                {/* First Name & Last Name */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name:</label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      className={`shadow-sm appearance-none border ${firstNameError ? 'border-red-500' : 'border-gray-300'} rounded w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      required
                    />
                    {firstNameError && <p className="text-red-500 text-xs italic mt-1">{firstNameError}</p>}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name:</label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={handleLastNameChange}
                      className={`shadow-sm appearance-none border ${lastNameError ? 'border-red-500' : 'border-gray-300'} rounded w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      required
                    />
                    {lastNameError && <p className="text-red-500 text-xs italic mt-1">{lastNameError}</p>}
                  </div>
                </div>
    
                {/* Email & Phone */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`shadow-sm appearance-none border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      required
                    />
                    {emailError && <p className="text-red-500 text-xs italic mt-1">{emailError}</p>}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`shadow-sm appearance-none border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      required
                    />
                    {phoneError && <p className="text-red-500 text-xs italic mt-1">{phoneError}</p>}
                  </div>
                </div>
    
                {/* Special Requests */}
                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">Special Requests:</label>
                  <textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                  />
                </div>
    
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
    
            {/* Right Side - Image */}
            <div className="hidden md:block w-full md:w-5/12">
              <div
                className="h-full w-full bg-cover bg-center rounded-r-lg"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')`,
                }}
              />
            </div>
    
          </div>
    
        </div>
    
        {/* Footer */}
        <Footer />
      </div>
    );
    
    
};

export default BookingForm;