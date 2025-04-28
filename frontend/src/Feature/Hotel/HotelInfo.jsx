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
        return (
             <div className="flex justify-center items-center h-64">
                <div className="text-center text-gray-500">Loading hotel information...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8 ml-5 w-200">
           
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                 
                 <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-200"> 
                    <img
                        src={hotel.coverPhoto || 'https://via.placeholder.com/1200x500/E8E8E8/AAAAAA?text=Hotel+Image'} 
                        alt={hotel.name || 'Hotel main image'}
                        className="w-full h-full object-cover" 
                        loading="lazy"
                    />
                 </div>

                <div className="p-6 md:p-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-['Poppins'] tracking-tight">
                        {hotel.name}
                    </h1>
                    <div className="text-gray-600 flex items-center mb-4 text-sm">
                        <FontAwesomeIcon icon={faLocationDot} className="text-red-500 mr-2 flex-shrink-0 text-base" />
                        <span className="font-medium">{hotel.location}</span>
                    </div>
                    <div className="flex items-center mb-5">
                        <span className="text-yellow-400 mr-2 flex items-center space-x-1">
                            
                            {typeof hotel.rating === 'number' && hotel.rating > 0 && hotel.rating <= 5 &&
                                Array(Math.round(hotel.rating)).fill().map((_, i) => <FontAwesomeIcon key={`star-${i}`} icon={faStar} className="text-lg" />)
                            }
                        </span>
                         {typeof hotel.rating === 'number' && hotel.rating > 0 && (
                            <span className="text-gray-500 text-sm font-medium">{hotel.rating?.toFixed(1)} / 5 Rating</span>
                         )}
                         {typeof hotel.rating !== 'number' || hotel.rating <= 0 && (
                            <span className="text-gray-400 text-sm italic">No rating available</span>
                         )}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base font-['Lato'] whitespace-pre-line"> 
                        {hotel.description}
                    </p>
                </div>
            </div>

            {/* Room Gallery Section */}
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

            {/* Amenities Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-['Poppins']">Hotel Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                    {amenitiesList.map((amenity, index) => (
                        <div key={index} className="flex items-center text-gray-700 text-sm sm:text-base">
                            <FontAwesomeIcon icon={amenity.icon} className="mr-3 text-base sm:text-lg text-indigo-500 w-5 text-center" />
                            <span className="font-medium">{amenity.name}</span>
                        </div>
                    ))}
                     <div className="flex items-center text-gray-700 text-sm sm:text-base">
                         <FontAwesomeIcon icon={faSwimmingPool} className="mr-3 text-base sm:text-lg text-indigo-500 w-5 text-center" />
                         <span className="font-medium">Pool Access</span>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default HotelInfo;