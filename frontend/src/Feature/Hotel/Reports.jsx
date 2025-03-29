import React, { useState, useEffect } from 'react';
import API from './services/api';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const Reports = () => {
    const [reportData, setReportData] = useState([]);
    const [checkInDateFrom, setCheckInDateFrom] = useState('');
    const [checkInDateTo, setCheckInDateTo] = useState('');
    const [checkOutDateFrom, setCheckOutDateFrom] = useState('');
    const [checkOutDateTo, setCheckOutDateTo] = useState('');
    const [bookingId, setBookingId] = useState('');
    const [hotelId, setHotelId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [reportError, setReportError] = useState('');
    const [hotels, setHotels] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                console.log("Fetching hotels...");
                const response = await API.get('/hotels');
                console.log("Hotels response:", response);
                setHotels(response.data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        const fetchAvailableRooms = async () => {
            try {
                console.log("Fetching rooms...");
                const response = await API.get('/rooms');
                console.log("Rooms response:", response);
                setAvailableRooms(response.data);
            } catch (error) {
                console.error("Error fetching available rooms:", error);
            }
        };

        fetchHotels();
        fetchAvailableRooms();
    }, []);

     // Filter rooms when hotelId changes
     useEffect(() => {
        if (hotelId) {
            const filtered = availableRooms.filter(room => room.hotelId === hotelId);
            setFilteredRooms(filtered);
        } else {
            setFilteredRooms([]);
        }
    }, [hotelId, availableRooms]);



    const generateReport = async () => {
        try {
            const params = new URLSearchParams();
            if (checkInDateFrom) params.append('checkInDateFrom', checkInDateFrom);
            if (checkInDateTo) params.append('checkInDateTo', checkInDateTo);
            if (checkOutDateFrom) params.append('checkOutDateFrom', checkOutDateFrom);
            if (checkOutDateTo) params.append('checkOutDateTo', checkOutDateTo);
            if (bookingId) params.append('bookingId', bookingId);
            if (hotelId) params.append('hotelId', hotelId);
            if (roomId) params.append('roomId', roomId);

            console.log("Generating report with params:", params.toString());
            const response = await API.get(`/reports?${params.toString()}`);
            console.log("Report response:", response.data);

            setReportData(response.data);
            setReportError('');
        } catch (error) {
            console.error("Error fetching report:", error.response?.data || error);
            setReportData([]);
            setReportError(error.response?.data?.message || "Failed to generate report.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Generate Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                    <label htmlFor="hotelId" className="block text-sm font-medium text-gray-700">Hotel Name</label>
                    <select
                        id="hotelId"
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={hotelId}
                        onChange={(e) => setHotelId(e.target.value)}
                    >
                        <option value="">All Hotels</option>
                        {hotels.length > 0 ? (
                            hotels.map((hotel) => (
                                <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                            ))
                        ) : (
                            <option>Loading hotels...</option>
                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">Room Number</label>
                    <select
                        id="roomId"
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    >
                        <option value="">All Rooms</option>
                        {filteredRooms.length > 0 ? (  // Use filtered rooms here
                            filteredRooms.map((room) => (
                                <option key={room._id} value={room._id}>{room.roomNumber}</option>
                            ))
                        ) : (
                            <option>No rooms available for this hotel</option>
                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700">Booking ID</label>
                    <input
                        type="text"
                        id="bookingId"
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                    />
                </div>
                
                 <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Check-in Date From */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="checkInDateFrom" className="block text-sm font-medium text-gray-700">
                        Check-in Date From
                        <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                    </label>
                    <input
                        type="date"
                        id="checkInDateFrom"
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={checkInDateFrom}
                        onChange={(e) => setCheckInDateFrom(e.target.value)}
                    />
                   </div>
                    {/* Check-in Date To */}
                   <div className="w-full md:w-1/2">
                    <label htmlFor="checkInDateTo" className="block text-sm font-medium text-gray-700">
                        Check-in Date To
                        <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                    </label>
                    <input
                        type="date"
                        id="checkInDateTo"
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={checkInDateTo}
                        onChange={(e) => setCheckInDateTo(e.target.value)}
                    />
                </div>
              </div>

                   
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Check-out Date From */}
                 <div className="w-full md:w-1/2">
                    <label htmlFor="checkOutDateFrom" className="block text-sm font-medium text-gray-700">
                        Check-out Date From
                        <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                    </label>
                    <input
                        type="date"
                        id="checkOutDateFrom"
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={checkOutDateFrom}
                        onChange={(e) => setCheckOutDateFrom(e.target.value)}
                    />
                  </div>
                {/* Check-out Date To */}
                    <div className="w-full md:w-1/2">
                    <label htmlFor="checkOutDateTo" className="block text-sm font-medium text-gray-700">
                        Check-out Date To
                        <FontAwesomeIcon icon={faCalendar} className="ml-2" />
                    </label>
                    <input
                        type="date"
                        id="checkOutDateTo"
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={checkOutDateTo}
                        onChange={(e) => setCheckOutDateTo(e.target.value)}
                    />
                  </div>
                </div>
            </div>
              

            <button
                onClick={generateReport}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Generate Report
            </button>

            {reportError && <p className="text-red-500 mt-4">{reportError}</p>}

            <div className="mt-6 overflow-x-auto">
                {reportData.length > 0 ? (
                    <table className="min-w-full border-collapse table-auto rounded-lg shadow-lg bg-white">
                        <thead className="bg-gray-100 text-gray-800 text-sm font-semibold">
                            <tr>
                                <th className="border-b px-4 py-3 text-left">Hotel Name</th>
                                <th className="border-b px-4 py-3 text-left">Booking ID</th>
                                <th className="border-b px-4 py-3 text-left">Room Number</th>
                                <th className="border-b px-4 py-3 text-left">Check-in Date</th>
                                <th className="border-b px-4 py-3 text-left">Check-out Date</th>
                                <th className="border-b px-4 py-3 text-left">Days Stayed</th>
                                <th className="border-b px-4 py-3 text-left">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {reportData.map((reportItem) => (
                                <tr key={reportItem._id} className="hover:bg-gray-50">
                                    <td className="border-b px-4 py-3">{reportItem.hotelName}</td>
                                    <td className="border-b px-4 py-3">{reportItem._id}</td>
                                    <td className="border-b px-4 py-3">{reportItem.roomNumber}</td>
                                    <td className="border-b px-4 py-3">{moment(reportItem.checkInDate).format('YYYY-MM-DD')}</td>
                                    <td className="border-b px-4 py-3">{moment(reportItem.checkOutDate).format('YYYY-MM-DD')}</td>
                                    <td className="border-b px-4 py-3">{reportItem.daysStayed}</td>
                                    <td className="border-b px-4 py-3">{reportItem.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-600">No data available for the selected criteria.</p>
                        <p className="text-gray-600">Please adjust your filters and try again.</p>
                    </div>
                    )
                }
            </div>
        </div>
    );
};

export default Reports;