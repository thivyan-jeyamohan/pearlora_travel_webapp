import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const HotelCheck = ({
    hotelId,checkInDate,setCheckInDate,checkOutDate, setCheckOutDate,handleCheckAvailability,isLoading,availabilityMessage,availableRooms = [],selectedRooms, handleRoomToggle,checkInDateError,checkOutDateError,minCheckInDate,minCheckOutDate,
}) => {

    const canBook = selectedRooms.length > 0 && checkInDate && checkOutDate && !checkInDateError && !checkOutDateError;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-120 ml-1 ">
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
                    min={minCheckInDate}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${checkInDateError ? 'border-red-500' : ''}`}
                />
                {checkInDateError && <p className="text-red-500 text-xs italic mt-1">{checkInDateError}</p>}
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
                    min={minCheckOutDate} 
                    disabled={!checkInDate || !!checkInDateError} 
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${checkOutDateError ? 'border-red-500' : ''} ${!checkInDate || !!checkInDateError ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                />
                {checkOutDateError && <p className="text-red-500 text-xs italic mt-1">{checkOutDateError}</p>}
            </div>

            <button
                onClick={handleCheckAvailability}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !checkInDate || !checkOutDate || !!checkInDateError || !!checkOutDateError}
            >
                {isLoading ? 'Checking...' : 'Check Availability'}
            </button>

            {availabilityMessage && (
                <p className="text-center text-gray-700 mb-4">{availabilityMessage}</p>
            )}

            {availableRooms.length > 0 && !isLoading && (
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Available Rooms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2"> 
                        {availableRooms.map(room => (
                            <div key={room._id} className="border rounded p-4 flex flex-col">
                                <img
                                    src={room.photo || '/placeholder-room.jpg'} 
                                    alt={`Room ${room.roomNumber}`}
                                    className="w-full h-32 object-cover rounded-md mb-2"
                                />
                                <p className="text-gray-800 font-medium">{room.roomNumber} ({room.roomCategory})</p>
                                <p className="text-gray-600 mb-2">{room.price} Rs / night</p>
                                <label className="flex items-center space-x-3 mt-auto cursor-pointer">
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

            {/* Booking Button Logic */}
            {canBook ? (
                <Link
                    to={`/booking/${hotelId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomIds=${selectedRooms.join(',')}`}
                    className="block w-full text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Book Now ({selectedRooms.length} Room{selectedRooms.length > 1 ? 's' : ''})
                </Link>
            ) : (
                <button
                    className="block w-full text-center bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-not-allowed"
                    disabled
                >
                    {availableRooms.length > 0 ? 'Select Room(s) to Book' : 'Check Availability First'}
                </button>
            )}
             {/*if dates are missing for booking */}
             {availableRooms.length > 0 && selectedRooms.length === 0 && !canBook && (
                <p className="text-orange-600 text-xs italic text-center mt-2">Select at least one available room to proceed.</p>
             )}
             {(!checkInDate || !checkOutDate || checkInDateError || checkOutDateError) && selectedRooms.length > 0 && (
                 <p className="text-red-500 text-xs italic text-center mt-2">Please select valid Check-in and Check-out dates.</p>
             )}


        </div>
    );
};

export default HotelCheck;