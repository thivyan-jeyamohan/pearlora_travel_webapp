import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faSpinner } from '@fortawesome/free-solid-svg-icons';

const HotelCheck = ({
    hotelId, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, handleCheckAvailability, isLoading, availabilityMessage, availableRooms = [], selectedRooms, handleRoomToggle, checkInDateError, checkOutDateError, minCheckInDate, minCheckOutDate,
}) => {

    const canBook = selectedRooms.length > 0 && checkInDate && checkOutDate && !checkInDateError && !checkOutDateError;


    return (
        
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 space-y-6 w-full "> 
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Poppins']">Reserve Your Stay</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date
                    </label>
                    <div className="relative rounded-md shadow-sm">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             
                             <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                         </div>
                        <input
                            type="date"
                            id="checkInDate"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            min={minCheckInDate}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm ${checkInDateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                    {checkInDateError && <p className="text-red-600 text-xs mt-1">{checkInDateError}</p>}
                </div>

                <div>
                    <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date
                    </label>
                     <div className="relative rounded-md shadow-sm">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                         </div>
                        <input
                            type="date"
                            id="checkOutDate"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            min={minCheckOutDate}
                            disabled={!checkInDate || !!checkInDateError}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm ${checkOutDateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} ${!checkInDate || !!checkInDateError ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                     </div>
                    {checkOutDateError && <p className="text-red-600 text-xs mt-1">{checkOutDateError}</p>}
                </div>
            </div>

            
            <button
                onClick={handleCheckAvailability}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                disabled={isLoading || !checkInDate || !checkOutDate || !!checkInDateError || !!checkOutDateError}
            >
                {isLoading ? (
                    <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Checking...
                    </>
                ) : 'Check Availability'}
            </button>

            {availabilityMessage && (
                 <p className={`text-center text-sm font-medium py-2 px-3 rounded-md ${availableRooms.length > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {availabilityMessage}
                </p>
            )}

             
            {availableRooms.length > 0 && !isLoading && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 font-['Poppins']">Available Rooms</h3>
                    
                    <div
                        className={`space-y-4 pr-2 ${ availableRooms.length > 3 ? 'max-h-80 overflow-y-auto' : '' }`}
                    >
                        {availableRooms.map((room) => (
                            <div
                                key={room._id} 
                                
                                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex flex-col sm:flex-row sm:items-center gap-4"
                            >
                                <img
                                     
                                    src={room.photo || 'https://via.placeholder.com/150x100/E8E8E8/AAAAAA?text=Room'}
                                    alt={`Room ${room.roomNumber}`}
                                    className="w-full sm:w-24 h-24 sm:h-auto object-cover rounded-md flex-shrink-0"
                                    loading="lazy"
                                />
                                <div className="flex-grow">
                                    
                                    <p className="text-gray-900 font-semibold text-sm">
                                        {room.roomNumber} <span className="text-gray-500 font-normal">({room.roomCategory})</span>
                                    </p>
                                     
                                    <p className="text-indigo-600 font-bold text-sm my-1">
                                        LKR {room.price ? room.price.toLocaleString() : 'N/A'} / night
                                    </p>
                                   
                                </div>
                                
                                <label className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0 mt-3 sm:mt-0">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                        value={room._id}
                                        checked={selectedRooms.includes(room._id)}
                                        onChange={() => handleRoomToggle(room._id)}
                                        disabled={isLoading}
                                    />
                                    <span className="text-gray-700 text-sm font-medium">Select</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            
            <div className="pt-4 border-t border-gray-200 mt-4"> 
                {canBook ? (
                    <Link
                        to={`/booking/${hotelId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomIds=${selectedRooms.join(',')}`}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                    >
                        Book Now ({selectedRooms.length} Room{selectedRooms.length > 1 ? 's' : ''} Selected)
                    </Link>
                ) : (
                    <button
                         
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-200 cursor-not-allowed"
                        disabled
                    >
                        
                        {availableRooms.length > 0 ? 'Select Room(s) to Book' : 'Check Availability First'}
                    </button>
                )}

                 
                 {availableRooms.length > 0 && selectedRooms.length === 0 && !canBook && (
                    <p className="text-orange-600 text-xs text-center mt-2">Select at least one available room to proceed.</p>
                 )}
                 {(!checkInDate || !checkOutDate || checkInDateError || checkOutDateError) && selectedRooms.length > 0 && (
                     <p className="text-red-600 text-xs text-center mt-2">Please select valid Check-in and Check-out dates.</p>
                 )}
            </div>
        </div>
    );
};

export default HotelCheck;