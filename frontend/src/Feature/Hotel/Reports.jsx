import React, { useState, useEffect } from 'react';
import API from './services/api';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faDownload } from '@fortawesome/free-solid-svg-icons';

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

    const [downloadingPdf, setDownloadingPdf] = useState(false);

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

    const downloadPdfReport = async () => {
        setDownloadingPdf(true); // Disable button
        try {
            // Construct the HTML table
            let tableHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Report</title>
                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin-top:40px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                      background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <table >
                    <thead>
                        <tr>
                            <th>Hotel Name</th>
                            <th>Booking ID</th>
                            <th>Room Numbers</th>
                            <th>Check-in Date</th>
                            <th>Check-out Date</th>
                            <th>Days Stayed</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reportData.map(item => `
                            <tr>
                                <td>${item.hotelName}</td>
                                <td>${item._id}</td>
                                <td>${Array.isArray(item.allRoomIds)
                                    ? item.allRoomIds.map(id => availableRooms.find(room => room._id === id)?.roomNumber || 'N/A').join(', ')
                                    : 'N/A'}</td>
                                <td>${moment(item.checkInDate).format('YYYY-MM-DD')}</td>
                                <td>${moment(item.checkOutDate).format('YYYY-MM-DD')}</td>
                                <td>${item.daysStayed}</td>
                                <td>Rs ${item.totalPrice}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
            `;

            const pdfShiftApiKey = 'sk_7987f7c5af0ff5e0330a842fa20f87c2e6349016';
            const pdfShiftApiUrl = 'https://api.pdfshift.io/v3/convert/pdf';

            // Base64 Encode API Key
            const apiKeyBase64 = btoa(`api:${pdfShiftApiKey}`);

            const requestBody = {
                source: tableHtml,
            };

            const response = await fetch(pdfShiftApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${apiKeyBase64}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`PDFShift API Error: ${response.status} - ${await response.text()}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            //reset page
            setReportData([]);
            setCheckInDateFrom('');
            setCheckInDateTo('');
            setCheckOutDateFrom('');
            setCheckOutDateTo('');
            setBookingId('');
            setHotelId('');
            setRoomId('');
            setReportError('');

        } catch (error) {
            console.error("Error generating and downloading PDF:", error);
            setReportError(`Failed to generate PDF: ${error.message}`);
        } finally {
            setDownloadingPdf(false); // Re-enable button
        }
    };


    return (
        <div className="container mx-auto  p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Generate Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Hotel Name */}
                <div>
                    <label htmlFor="hotelId" className="block text-sm font-medium text-gray-700">
                        Hotel Name
                    </label>
                    <div className="mt-1">
                        <select
                            id="hotelId"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                            value={hotelId}
                            onChange={(e) => setHotelId(e.target.value)}
                        >
                            <option value="">All Hotels</option>
                            {hotels.length > 0 ? (
                                hotels.map((hotel) => (
                                    <option key={hotel._id} value={hotel._id}>
                                        {hotel.name}
                                    </option>
                                ))
                            ) : (
                                <option>Loading hotels...</option>
                            )}
                        </select>
                    </div>
                </div>
                {/* Room Number */}
                <div>
                    <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                        Room Number
                    </label>
                    <div className="mt-1">
                        <select
                            id="roomId"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        >
                            <option value="">All Rooms</option>
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((room) => (
                                    <option key={room._id} value={room._id}>
                                        {room.roomNumber}
                                    </option>
                                ))
                            ) : (
                                <option>No rooms available for this hotel</option>
                            )}
                        </select>
                    </div>
                </div>
                {/* Booking ID */}
                <div>
                    <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700">
                        Booking ID
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="bookingId"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                        />
                    </div>
                </div>

                {/* Check-in Date From */}
                <div>
                    <label htmlFor="checkInDateFrom" className="block text-sm font-medium text-gray-700">
                        Check-in Date From
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
                        </div>
                        <input
                            type="date"
                            id="checkInDateFrom"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-3"
                            value={checkInDateFrom}
                            onChange={(e) => setCheckInDateFrom(e.target.value)}
                        />
                    </div>
                </div>

                {/* Check-in Date To */}
                <div>
                    <label htmlFor="checkInDateTo" className="block text-sm font-medium text-gray-700">
                        Check-in Date To
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
                        </div>
                        <input
                            type="date"
                            id="checkInDateTo"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-3"
                            value={checkInDateTo}
                            onChange={(e) => setCheckInDateTo(e.target.value)}
                        />
                    </div>
                </div>

                {/* Check-out Date From */}
                <div>
                    <label htmlFor="checkOutDateFrom" className="block text-sm font-medium text-gray-700">
                        Check-out Date From
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
                        </div>
                        <input
                            type="date"
                            id="checkOutDateFrom"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-3"
                            value={checkOutDateFrom}
                            onChange={(e) => setCheckOutDateFrom(e.target.value)}
                        />
                    </div>
                </div>

                {/* Check-out Date To */}
                <div>
                    <label htmlFor="checkOutDateTo" className="block text-sm font-medium text-gray-700">
                        Check-out Date To
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
                        </div>
                        <input
                            type="date"
                            id="checkOutDateTo"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-3"
                            value={checkOutDateTo}
                            onChange={(e) => setCheckOutDateTo(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={generateReport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
                Submit
            </button>

            {reportError && <p className="text-red-500 mt-4">{reportError}</p>}

            <div className="mt-8 overflow-x-auto mb-8">
                {reportData.length > 0 ? (
                    <>
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                                        Hotel Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                                        Booking ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                                        Room Numbers
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                                        Check-in Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                                        Check-out Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                                        Days Stayed
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                                        Total Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.map((reportItem) => (
                                    <tr key={reportItem._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reportItem.hotelName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reportItem._id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {Array.isArray(reportItem.allRoomIds)
                                                ? reportItem.allRoomIds.map(id => availableRooms.find(room => room._id === id)?.roomNumber || 'N/A').join(', ')
                                                : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{moment(reportItem.checkInDate).format('YYYY-MM-DD')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{moment(reportItem.checkOutDate).format('YYYY-MM-DD')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reportItem.daysStayed}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reportItem.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         <button
                            onClick={downloadPdfReport}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mt-4"
                            disabled={downloadingPdf}
                        >
                            {downloadingPdf ? (
                                "Generating PDF..."
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No data available for the selected criteria.</p>
                        <p className="text-gray-600">Please adjust your filters and try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;