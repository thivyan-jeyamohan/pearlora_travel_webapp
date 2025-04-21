import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faWifi, faSwimmingPool, faParking, faSmoking, faPaw, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const amenitiesList = [
    { name: 'Free Wi-Fi', icon: faWifi },
    { name: 'Swimming Pool', icon: faSwimmingPool },
    { name: 'Free Parking', icon: faParking },
    { name: 'Smoking Allowed', icon: faSmoking },
    { name: 'Pet-Friendly', icon: faPaw },
];

const HotelInfo = ({ hotel }) => {
    if (!hotel) {
        return <div>Loading hotel details...</div>; 
    }

    return (
        <div className="ml-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <img
                    src={hotel.coverPhoto || '/placeholder-image.jpg'}
                    alt={hotel.name}
                    className="w-180 h-64 object-cover rounded-t-xl ml-9 mt-7" 
                />
    
                <div className="p-8">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-3 font-['Poppins']"> 
                        {hotel.name}
                    </h1>
                    <div className="text-gray-600 flex items-center mb-4 text-sm"> 
                        <FontAwesomeIcon icon={faLocationDot} className="text-red-500 mr-2 flex-shrink-0" /> 
                        <span>{hotel.location}</span>
                    </div>
                    <div className="flex items-center mb-5"> 
                        <span className="text-yellow-500 mr-2 flex items-center space-x-1"> 
                            {typeof hotel.rating === 'number' && hotel.rating > 0 && hotel.rating <= 5 &&
                                Array(Math.floor(hotel.rating)).fill().map((_, i) => <FontAwesomeIcon key={i} icon={faStar} />)
                            }
                        </span>
                        <span className="text-gray-500 text-sm">{hotel.rating} / 5</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base font-['Lato']"> 
                        {hotel.description}
                    </p>
                </div>
            </div>

            {/* Room Previews */}
            {hotel.rooms && hotel.rooms.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Rooms</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {hotel.rooms.slice(0, 4).map(room => (
                            <div key={room._id} className="relative">
                                <img
                                    src={room.photo || '/placeholder-room.jpg'}
                                    alt={`Room ${room.roomNumber}`}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                    {amenitiesList.map((amenity, index) => (
                        <div key={index} className="flex items-center text-gray-700">
                            <FontAwesomeIcon icon={amenity.icon} className="mr-2 text-blue-500" />
                            <span>{amenity.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelInfo;