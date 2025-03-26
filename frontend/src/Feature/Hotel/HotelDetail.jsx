import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from './services/api';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faWifi, faSwimmingPool, faParking, faSmoking, faPaw } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const HotelDetail = ({ fetchBookings }) => {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState("65b5a38efbd544a87204b73a");    // Temperary staticUserId
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null); // to show photo
    const [totalPrice, setTotalPrice] = useState(0);


    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const { data } = await API.get(`/hotels/${hotelId}`);
                setHotel(data);
            } catch (error) {
                console.error("Error fetching hotel:", error);
                setAvailabilityMessage("Error fetching hotel details.");
            }
        };
        fetchHotel();
    }, [hotelId]);

    const formatDateForAPI = (date) => {
        return moment(date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    };

    const checkRoomAvailability = async () => {
        if (!checkInDate || !checkOutDate) {
            setAvailabilityMessage("Please select check-in and check-out dates.");
            return;
        }

        setIsLoading(true);
        setAvailabilityMessage('');
        setSelectedRooms([]);

        const formattedCheckInDate = formatDateForAPI(checkInDate);
        const formattedCheckOutDate = formatDateForAPI(checkOutDate);

        try {
            const response = await API.post('/rooms/check-availability', {
                hotelId: hotelId,
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
            });

            if (response.data && response.data.availableRooms) {
                setAvailableRooms(response.data.availableRooms);
                setAvailabilityMessage(`${response.data.availableRooms.length} rooms available!`);
            } else {
                setAvailableRooms([]);
                setAvailabilityMessage("No rooms available for the selected dates.");
            }
        } catch (error) {
            console.error("Error checking room availability:", error);
            setAvailableRooms([]);
            setAvailabilityMessage("Error checking availability. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleRoomToggle = (roomId) => {
        setSelectedRooms(prev => {
            const newSelectedRooms = prev.includes(roomId)
                ? prev.filter(id => id !== roomId)
                : [...prev, roomId];

            if (availableRooms && availableRooms.length > 0) {
                const newSelectedRoomDetails = availableRooms.filter(room => newSelectedRooms.includes(room._id));
                setSelectedRoomDetails(newSelectedRoomDetails);

                // Calculate total price
                const numberOfDays = moment(checkOutDate).diff(moment(checkInDate), 'days');
                const newTotalPrice = newSelectedRoomDetails.reduce((acc, room) => acc + room.price * numberOfDays, 0);
                setTotalPrice(newTotalPrice);
            } else {
                setSelectedRoomDetails([]);
                setTotalPrice(0);
            }

            return newSelectedRooms;
        });
    };


    const handleShowBookingForm = () => {
        if (selectedRooms.length > 0 && checkInDate && checkOutDate) {
            setAvailabilityMessage("");

            const selectedRoomDetails = availableRooms.filter(room => selectedRooms.includes(room._id));
            setSelectedRoomDetails(selectedRoomDetails);

            const numberOfDays = moment(checkOutDate).diff(moment(checkInDate), 'days');
            const newTotalPrice = selectedRoomDetails.reduce((acc, room) => acc + room.price * numberOfDays, 0);
            setTotalPrice(newTotalPrice)

            setShowBookingForm(true);

        } else {
            setAvailabilityMessage("Please select rooms and dates before booking.");
        }
    };


    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !phone) {
            setAvailabilityMessage("Please fill in all required fields.");
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

            if (response.status === 200) {
                setAvailabilityMessage("Booking successful!");
                setShowBookingForm(false); // Hide the form after successful booking
                setSelectedRooms([]); // Clear selected rooms
                setTotalPrice(0);   // Reset total price
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setSpecialRequests('');

                // Optionally, refresh bookings list on successful booking
                if (fetchBookings) {
                    fetchBookings();
                }
            } else {
                setAvailabilityMessage("Failed to book. Please check details and try again.");
            }
        } catch (error) {
            console.error("Error booking rooms:", error);
            setAvailabilityMessage(error.response?.data?.message || "Failed to book. Please check details and try again.");
        }
    };

    const amenities = [
        { name: 'Free Wi-Fi', icon: faWifi },
        { name: 'Swimming Pool', icon: faSwimmingPool },
        { name: 'Free Parking', icon: faParking },
        { name: 'Smoking Allowed', icon: faSmoking },
        { name: 'Pet-Friendly', icon: faPaw },
    ];

    return (
        <div className="bg-gray-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {hotel ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Hotel Details and Image */}
                        <div className="flex flex-col">

                            {/* Main Hotel Image */}
                            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={hotel.coverPhoto} alt={hotel.name} className="object-cover w-full h-72" />
                                <div className="p-4">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                                    <p className="text-gray-700"><FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" /> {hotel.location}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-yellow-500">
                                            {Array(hotel.rating).fill().map((_, i) => <FontAwesomeIcon key={i} icon={faStar} />)}
                                        </span>
                                        <span className="ml-2 text-gray-500">{hotel.rating} / 5</span>
                                    </div>
                                </div>
                            </div>

                            {/* Room Images Gallery */}
                            <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Rooms</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {hotel.rooms && hotel.rooms.slice(0, 4).map(room => (
                                        <div key={room._id} className="relative">
                                            <img
                                                src={room.photo}
                                                alt={room.roomNumber}
                                                className="w-full h-32 object-cover rounded-md"
                                            />
                                        </div>
                                    ))}

                                </div>
                            </div>
                            {/* Hotel Details and Amenities */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Hotel Details</h2>
                                <p className="text-gray-800 leading-relaxed mb-4">{hotel.description}</p>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center text-gray-700">
                                            <FontAwesomeIcon icon={amenity.icon} className="mr-2 text-blue-500" />
                                            <span>{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Booking and Availability */}
                        <div className="flex flex-col">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Book Your Stay</h2>

                                <div className="mb-4">
                                    <label htmlFor="checkInDate" className="block text-gray-700 text-sm font-bold mb-2">Check-in Date:</label>
                                    <input
                                        type="date"
                                        id="checkInDate"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="checkOutDate" className="block text-gray-700 text-sm font-bold mb-2">Check-out Date:</label>
                                    <input
                                        type="date"
                                        id="checkOutDate"
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>

                                {/* Move Check Availability Button here */}
                                <button
                                    onClick={checkRoomAvailability}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Checking...' : 'Check Availability'}
                                </button>

                                {availabilityMessage && (
                                    <p className="text-center text-gray-700 mb-4">{availabilityMessage}</p>
                                )}

                                {/* Display Available Rooms */}
                                {availableRooms.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Available Rooms</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {availableRooms.map(room => (
                                                <div key={room._id} className="border rounded p-4">
                                                    <p>{room.roomNumber} ({room.roomCategory}) - ${room.price}</p>
                                                    <img
                                                        src={room.photo}
                                                        alt={room.roomNumber}
                                                        className="w-full h-32 object-cover rounded-md"
                                                    />

                                                    {/* Room Selection Checkbox */}
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
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    disabled={selectedRooms.length === 0 || !checkInDate || !checkOutDate || isLoading}
                                >
                                    Book Now
                                </button>
                            </div>

                            {/* Booking Form */}
                            {showBookingForm && (
                                <div className="bg-white rounded-lg shadow-md p-6">
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
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
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
                                        <button
                                            type="submit"
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Confirm Booking
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-600">Loading hotel details...</div>
                )}
            </div>
        </div>
    );
};

export default HotelDetail;