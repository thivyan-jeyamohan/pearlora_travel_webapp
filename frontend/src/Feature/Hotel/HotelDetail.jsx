import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from './services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faWifi, faSwimmingPool, faParking, faSmoking, faPaw, faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone'; // Import moment-timezone

const HotelDetail = () => {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkInDateError, setCheckInDateError] = useState('');
    const [checkOutDateError, setCheckOutDateError] = useState('');

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

    const checkRoomAvailability = async (checkInDate, checkOutDate) => {
        setIsLoading(true);
        setAvailabilityMessage('');
        setSelectedRooms([]);

        try {
            const response = await API.post('/rooms/check-availability', {
                hotelId: hotelId,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
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
            return prev.includes(roomId)
                ? prev.filter(id => id !== roomId)
                : [...prev, roomId];
        });
    };

    const amenities = [
        { name: 'Free Wi-Fi', icon: faWifi },
        { name: 'Swimming Pool', icon: faSwimmingPool },
        { name: 'Free Parking', icon: faParking },
        { name: 'Smoking Allowed', icon: faSmoking },
        { name: 'Pet-Friendly', icon: faPaw },
    ];

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

        checkRoomAvailability(checkInDate, checkOutDate);
    };

    return (
        <div className="font-sans bg-gray-100 min-h-screen py-12 mt-20 mr-40 ml-40">
            <div className="container mx-auto px-4">
                {hotel ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Hotel Details */}
                        <div className="ml-10">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 ">
                                <img src={hotel.coverPhoto} alt={hotel.name} className="w-full h-64 object-cover" />
                                <div className="p-6">
                                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">{hotel.name}</h1>
                                    <p className="text-gray-600 flex items-center mb-4">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-red-500 mr-2" />
                                        {hotel.location}
                                    </p>
                                    <div className="flex items-center mb-4">
                                        <span className="text-yellow-500 mr-2">
                                            {Array(hotel.rating).fill().map((_, i) => <FontAwesomeIcon key={i} icon={faStar} />)}
                                        </span>
                                        <span className="text-gray-500">{hotel.rating} / 5</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
                                </div>
                            </div>

                            {hotel.rooms && hotel.rooms.length > 0 && (
                                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Rooms</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {hotel.rooms.slice(0, 4).map(room => (
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
                            )}

                            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center text-gray-700">
                                            <FontAwesomeIcon icon={amenity.icon} className="mr-2 text-blue-500" />
                                            <span>{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Booking Availability Form */}
                        <div className="bg-white rounded-lg shadow-md p-6 w-130 ml-1">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Check Availability</h2>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {availableRooms.map(room => (
                                            <div key={room._id} className="border rounded p-4">
                                                <p className="text-gray-800">{room.roomNumber} ({room.roomCategory}) - {room.price}Rs</p>
                                                <img
                                                    src={room.photo}
                                                    alt={room.roomNumber}
                                                    className="w-full h-32 object-cover rounded-md mb-2"
                                                />
                                                <label className="flex items-center space-x-3">
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
                              {selectedRooms.length > 0 && checkInDate && checkOutDate && (
                                <Link
                                    to={`/booking/${hotelId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomIds=${selectedRooms.join(',')}`}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block"
                                >
                                    Book Now
                                </Link>
                            )}
                            {selectedRooms.length === 0 && (
                                <button
                                    className="bg-gray-400 w-50 ml-8 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-not-allowed"
                                    disabled
                                >
                                    Select Rooms to Book
                                </button>
                            )}
                            {(!checkInDate || !checkOutDate) && (
                                <p className="text-red-500 text-xs italic">Please select Check-in and Check-out dates.</p>
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