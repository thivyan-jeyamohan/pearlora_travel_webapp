import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from './services/api';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faWifi, faSwimmingPool, faParking, faSmoking, faPaw, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import BookingForm from './BookingForm'; // Import the BookingForm component
import moment from 'moment'; // Import moment

const HotelDetail = () => {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
    const [bookingSuccessful, setBookingSuccessful] = useState(false);

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
    }, [hotelId, bookingSuccessful]);

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
            const newSelectedRooms = prev.includes(roomId)
                ? prev.filter(id => id !== roomId)
                : [...prev, roomId];

            if (availableRooms && availableRooms.length > 0) {
                const newSelectedRoomDetails = availableRooms.filter(room => newSelectedRooms.includes(room._id));
                setSelectedRoomDetails(newSelectedRoomDetails);

                if (checkInDate && checkOutDate) {
                    const startDate = moment(checkInDate);
                    const endDate = moment(checkOutDate);
                    const numberOfDays = endDate.diff(startDate, 'days');
                    const newTotalPrice = newSelectedRoomDetails.reduce((acc, room) => acc + room.price * numberOfDays, 0);
                    setTotalPrice(newTotalPrice);
                }
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
            setShowBookingForm(true);
        } else {
            setAvailabilityMessage("Please select rooms and dates before booking.");
        }
    };

    const handleBookingSuccess = () => {
        console.log("handleBookingSuccess called in HotelDetail");  // Add this line
        setBookingSuccessful(true);
    };

    const amenities = [
        { name: 'Free Wi-Fi', icon: faWifi },
        { name: 'Swimming Pool', icon: faSwimmingPool },
        { name: 'Free Parking', icon: faParking },
        { name: 'Smoking Allowed', icon: faSmoking },
        { name: 'Pet-Friendly', icon: faPaw },
    ];

    return (
        <div className="bg-gray-100 py-12 mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {hotel ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ml-20">
                        {/* Left Column: Hotel Details and Image */}
                        <div className="flex flex-col">

                            {/* Main Hotel Image */}
                            <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={hotel.coverPhoto} alt={hotel.name} className="object-cover w-full h-72" />
                                <div className="p-4">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                                    <p className="text-gray-700"><FontAwesomeIcon icon={faLocationDot} className="text-red-500 mr-1" /> {hotel.location}</p>
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
                        <div className="flex flex-col mr-20">
                            {!showBookingForm && !bookingSuccessful && (
                                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Book Your Stay</h2>

                                    <BookingForm
                                        checkInDate={checkInDate}
                                        setCheckInDate={setCheckInDate}
                                        checkOutDate={checkOutDate}
                                        setCheckOutDate={setCheckOutDate}
                                        availableRooms={availableRooms}
                                        selectedRooms={selectedRooms}
                                        handleRoomToggle={handleRoomToggle}
                                        isLoading={isLoading}
                                        availabilityMessage={availabilityMessage}
                                        handleShowBookingForm={handleShowBookingForm}
                                        setAvailabilityMessage={setAvailabilityMessage}
                                        setTotalPrice={setTotalPrice}
                                        onCheckRoomAvailability={checkRoomAvailability}
                                    />
                                </div>
                            )}

                            {showBookingForm && !bookingSuccessful && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <BookingForm
                                        hotelId={hotelId}
                                        checkInDate={checkInDate}
                                        checkOutDate={checkOutDate}
                                        availableRooms={availableRooms}
                                        selectedRooms={selectedRooms}
                                        selectedRoomDetails={selectedRoomDetails}
                                        totalPrice={totalPrice}
                                        handleBookingSuccess={handleBookingSuccess}
                                        setAvailabilityMessage={setAvailabilityMessage}
                                        setSelectedRooms={setSelectedRooms}
                                        setTotalPrice={setTotalPrice}
                                        setShowBookingForm={setShowBookingForm}
                                        setCheckInDate={setCheckInDate}
                                        setCheckOutDate={setCheckOutDate}
                                        setAvailableRooms={setAvailableRooms}
                                        setSelectedRoomDetails={setSelectedRoomDetails}
                                    />
                                </div>
                            )}

                            {bookingSuccessful && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <p className="text-center text-green-500 font-bold">Booking successful! The hotel details have been reloaded.</p>
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