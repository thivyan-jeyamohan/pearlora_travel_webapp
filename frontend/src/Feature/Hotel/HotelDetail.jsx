// HotelDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import API from './services/api.js';
import moment from 'moment-timezone';
import Footer from '../../components/Footer';
import HotelInfo from './HotelInfo';
import HotelCheck from './HotelCheck';

const HotelDetail = () => {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHotelLoading, setIsHotelLoading] = useState(true);
    const [checkInDateError, setCheckInDateError] = useState('');
    const [checkOutDateError, setCheckOutDateError] = useState('');

    const minCheckInDate = moment().format('YYYY-MM-DD');
    const minCheckOutDate = checkInDate ? moment(checkInDate).add(1, 'day').format('YYYY-MM-DD') : '';

    useEffect(() => {
        const fetchHotel = async () => {
            setIsHotelLoading(true);
            setHotel(null);
            try {
                const { data } = await API.get(`/hotels/${hotelId}`);
                setHotel(data);
            } catch (error) {
                console.error("Error fetching hotel:", error);
                setAvailabilityMessage("Error fetching hotel details.");
            } finally {
                setIsHotelLoading(false);
            }
        };
        fetchHotel();
    }, [hotelId]);

    useEffect(() => {
        if (!checkInDate) {
            setCheckInDateError("");
            setCheckOutDate("");
            setAvailableRooms([]);
            setAvailabilityMessage('');
            setSelectedRooms([]);
            return;
        }

        const checkIn = moment(checkInDate);
        if (checkIn.isBefore(minCheckInDate, 'day')) {
            setCheckInDateError("Check-in date cannot be in the past.");
        } else {
            setCheckInDateError("");
            if (checkOutDate && moment(checkOutDate).isSameOrBefore(checkIn, 'day')) {
                setCheckOutDate("");
                setCheckOutDateError("Check-out date must be after check-in date.");
                setAvailableRooms([]);
                setAvailabilityMessage('');
                setSelectedRooms([]);
            } else {
                 setCheckOutDateError("");
            }
        }
         setAvailableRooms([]);
         setAvailabilityMessage('');
         setSelectedRooms([]);

    }, [checkInDate, minCheckInDate, checkOutDate]);

    useEffect(() => {
        if (!checkOutDate) {
            setCheckOutDateError("");
            setAvailableRooms([]);
            setAvailabilityMessage('');
            setSelectedRooms([]);
            return;
        }

        if (checkInDate && !checkInDateError) {
            const checkIn = moment(checkInDate);
            const checkOut = moment(checkOutDate);

            if (checkOut.isSameOrBefore(checkIn, 'day')) {
                setCheckOutDateError("Check-out date must be after check-in date.");
            } else {
                setCheckOutDateError("");
            }
            setAvailableRooms([]);
            setAvailabilityMessage('');
            setSelectedRooms([]);
        } else {
            setCheckOutDateError("");
        }

    }, [checkOutDate, checkInDate, checkInDateError]);

    const checkRoomAvailability = useCallback(async () => {
        if (!hotelId || !checkInDate || !checkOutDate || checkInDateError || checkOutDateError || !hotel) {
             setAvailabilityMessage("Please select valid check-in and check-out dates.");
            return;
        }
        setIsLoading(true);
        setAvailabilityMessage('');
        setAvailableRooms([]);
        setSelectedRooms([]);
        try {
            const response = await API.post('/rooms/check-availability', {
                hotelId: hotelId,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
            });

            if (response.data && response.data.availableRooms) {
                setAvailableRooms(response.data.availableRooms);
                if (response.data.availableRooms.length > 0) {
                    setAvailabilityMessage(`${response.data.availableRooms.length} room type(s) available! Select rooms below.`);
                } else {
                    setAvailabilityMessage("No rooms available for the selected dates.");
                }
            } else {
                setAvailableRooms([]);
                setAvailabilityMessage("No rooms available or error fetching data.");
            }
        } catch (error) {
            console.error("Error checking room availability:", error);
            setAvailableRooms([]);
            const errorMessage = error.response?.data?.message || "Error checking availability. Please try again.";
            setAvailabilityMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [hotelId, checkInDate, checkOutDate, checkInDateError, checkOutDateError, hotel]);

    const handleRoomToggle = (roomId) => {
        setSelectedRooms(prev => {
            return prev.includes(roomId)
                ? prev.filter(id => id !== roomId)
                : [...prev, roomId];
        });
    };

    const handleCheckAvailabilityClick = () => {
        checkRoomAvailability();
    };


    return (
        <div className="font-sans bg-gradient-to-br from-purple-400 via-blue-300 to-purple-200 min-h-screen flex flex-col pt-16 md:pt-20">
            <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-16 xl:px-20 py-8 flex-grow">
                {isHotelLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center text-gray-600 text-xl">Loading hotel details...</div>
                    </div>
                ) : hotel ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-10">
                        <div className="lg:col-span-3">
                             <HotelInfo hotel={hotel} />
                        </div>
                        <div className="lg:col-span-2">
                           <div className="sticky top-24">
                                <HotelCheck
                                    hotelId={hotelId}
                                    checkInDate={checkInDate}
                                    setCheckInDate={setCheckInDate}
                                    checkOutDate={checkOutDate}
                                    setCheckOutDate={setCheckOutDate}
                                    isLoading={isLoading}
                                    handleCheckAvailability={handleCheckAvailabilityClick}
                                    availabilityMessage={availabilityMessage}
                                    availableRooms={availableRooms}
                                    selectedRooms={selectedRooms}
                                    handleRoomToggle={handleRoomToggle}
                                    checkInDateError={checkInDateError}
                                    checkOutDateError={checkOutDateError}
                                    minCheckInDate={minCheckInDate}
                                    minCheckOutDate={minCheckOutDate}
                                />
                           </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-red-600 text-xl py-10">Could not load hotel details. Please try again later.</div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default HotelDetail;