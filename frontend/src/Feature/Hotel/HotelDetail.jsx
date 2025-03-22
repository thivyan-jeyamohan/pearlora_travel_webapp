import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const HotelDetail = () => {
    const { hotelId } = useParams(); // Get the hotel ID from the URL params
    const [hotel, setHotel] = useState(null); // Store hotel details
    const [selectedRoom, setSelectedRoom] = useState(null); // Store selected room
    const [checkInDate, setCheckInDate] = useState(''); // Check-in date
    const [checkOutDate, setCheckOutDate] = useState(''); // Check-out date
    const [availabilityMessage, setAvailabilityMessage] = useState(''); // Display availability message

    // Fetch hotel details from API
    useEffect(() => {
        const fetchHotel = async () => {
            const { data } = await API.get(`/hotels/${hotelId}`);
            setHotel(data);
        };

        fetchHotel();
    }, [hotelId]);

    // Check room availability for selected dates
    const checkAvailability = async () => {
        try {
            const response = await API.post('/hotels/check-availability', {
                hotelId,
                roomId: selectedRoom.roomId,
                checkInDate,
                checkOutDate
            });
            setAvailabilityMessage('Room is available!');
        } catch (error) {
            setAvailabilityMessage(error.response.data.message);
        }
    };

    return (
        <div className="hotel-detail-container">
            {hotel ? (
                <>
                    <div className="hotel-header">
                        <img src={hotel.coverPhoto} alt={hotel.name} className="w-full h-64 object-cover" />
                        <h1 className="text-4xl">{hotel.name}</h1>
                        <p>{hotel.location}</p>
                        <p>{hotel.rating} stars</p>
                    </div>

                    {/* Room Selection and Availability */}
                    <div className="room-selection">
                        <h2>Select a Room</h2>
                        <select onChange={(e) => setSelectedRoom(hotel.rooms[e.target.value])}>
                            {hotel.rooms.map((room, index) => (
                                <option key={room.roomId} value={index}>
                                    {room.roomNumber} - ${room.price} per night
                                </option>
                            ))}
                        </select>

                        <div>
                            <label>Check-in Date</label>
                            <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Check-out Date</label>
                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                            />
                        </div>

                        <button onClick={checkAvailability}>Check Availability</button>

                        {availabilityMessage && <p>{availabilityMessage}</p>}
                    </div>
                </>
            ) : (
                <p>Loading hotel details...</p>
            )}
        </div>
    );
};

export default HotelDetail;
