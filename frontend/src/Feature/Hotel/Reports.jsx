import React, { useState, useEffect } from 'react';
import API from './services/api'; 
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faDownload } from '@fortawesome/free-solid-svg-icons';
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from './images/logo.png'; 


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
            const filtered = availableRooms.filter(room => String(room.hotelId) === String(hotelId));
            setFilteredRooms(filtered);
            setRoomId('');
        } else {
            setFilteredRooms([]); 
            setRoomId(''); 
        }
    }, [hotelId, availableRooms]);

    
    useEffect(() => {
        if (checkInDateFrom && checkInDateTo && moment(checkInDateTo).isBefore(checkInDateFrom)) {
            setCheckInDateTo(''); 
        }
    }, [checkInDateFrom, checkInDateTo]);

    useEffect(() => {
        if (checkInDateFrom && checkOutDateFrom && moment(checkOutDateFrom).isBefore(checkInDateFrom)) {
             setCheckOutDateFrom('');
        }
    }, [checkInDateFrom, checkOutDateFrom]);

    useEffect(() => {
        if (checkOutDateFrom && checkOutDateTo && moment(checkOutDateTo).isBefore(checkOutDateFrom)) {
            setCheckOutDateTo(''); 
        }
         if (!checkOutDateFrom && checkInDateFrom && checkOutDateTo && moment(checkOutDateTo).isBefore(checkInDateFrom)) {
             setCheckOutDateTo('');
         }
    }, [checkOutDateFrom, checkOutDateTo, checkInDateFrom]);


    const generateReport = async () => {
        setReportError(''); 
        setReportData([]); 
        try {
            const params = new URLSearchParams();

            if (checkInDateFrom) params.append('checkInDateFrom', checkInDateFrom);
            if (checkInDateTo) params.append('checkInDateTo', checkInDateTo);
            if (checkOutDateFrom) params.append('checkOutDateFrom', checkOutDateFrom);
            if (checkOutDateTo) params.append('checkOutDateTo', checkOutDateTo);
            if (hotelId) params.append('hotelId', hotelId);
            if (roomId) params.append('roomId', roomId);

            console.log("Generating report with params:", params.toString());
            const response = await API.get(`/reports?${params.toString()}`);
            console.log("Report response:", response.data);

            setReportData(response.data || []); 

        } catch (error) {
            console.error("Error fetching report:", error.response?.data || error);
            setReportData([]); 
            setReportError(error.response?.data?.message || "Failed to generate report. Check console for details.");
        }
    };


    const downloadPdfReport = async () => {
        setDownloadingPdf(true);
    
        try {
            const doc = new jsPDF();
            doc.setFont("helvetica", "bold");
    
            //  logo 
            doc.addImage(logo, "PNG", 14, 10, 30, 30);
    
            // Title
            doc.setFontSize(20);
            const title = "Hotel Booking Report".toUpperCase();
            doc.text(title, 105, 20, null, null, "center");
    
            // Table Headers
            const tableColumn = [
            "Hotel Name",
            "Booking Ref",
            "Room Num",
            "Check-in Date",
            "Check-out Date",
            "Days",
            "Total Price"
            ];
    
            // Table Rows
            const tableRows = reportData.map(item => [
            item.hotelName,
            item.bookingId,
            Array.isArray(item.allRoomIds)
                ? item.allRoomIds
                    .map(id => availableRooms.find(room => room._id === id)?.roomNumber || 'N/A')
                    .join(", ")
                : 'N/A',
            moment(item.checkInDate).format("YYYY-MM-DD"),
            moment(item.checkOutDate).format("YYYY-MM-DD"),
            item.daysStayed,
            `LKR ${item.totalPrice}`
            ]);
    
            // Draw Table
            doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            headStyles: {
                fillColor: [82, 2, 153],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            bodyStyles: {
                fillColor: [245, 245, 245],
                textColor: [0, 0, 0],
            },
            margin: { top: 40, bottom: 30 },
            });
    
            // Footer
            const generatedDate = new Date().toLocaleString();
            doc.setFontSize(10);
            doc.text(`Generated on: ${generatedDate}`, 105, doc.lastAutoTable.finalY + 20, null, null, "center");
            doc.text("Generated By: Hotel Manager - Kesigan Mukuntharathan", 105, doc.lastAutoTable.finalY + 30, null, null, "center");
    
            // Save
            doc.save("hotel_booking_report.pdf");
    
            // Reset state
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
            setDownloadingPdf(false);
        }
    };

    
    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">Generate Report</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                <div>
                    <label htmlFor="hotelId" className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
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
                            <option disabled>Loading hotels...</option>
                        )}
                    </select>
                </div>

                <div>
                    <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                        Room Number
                    </label>
                    <select
                        id="roomId"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        disabled={!hotelId || filteredRooms.length === 0} 
                    >
                        <option value="">All Rooms</option>
                        {hotelId && filteredRooms.length > 0 ? (
                            filteredRooms.map((room) => (
                                <option key={room._id} value={room._id}>
                                    {room.roomNumber}
                                </option>
                            ))
                        ) : hotelId ? (
                             <option disabled>No rooms for selected hotel</option>
                        ) : (
                            <option disabled>Select a hotel first</option>
                        )}
                    </select>
                </div>

                
                <div>
                    <label htmlFor="checkInDateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date From
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                        </div>
                        <input
                            type="date"
                            id="checkInDateFrom"
                            name="checkInDateFrom"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-3"
                            value={checkInDateFrom}
                            onChange={(e) => setCheckInDateFrom(e.target.value)}
                            max={checkInDateTo || undefined}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="checkInDateTo" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date To
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                        </div>
                        <input
                            type="date"
                            id="checkInDateTo"
                            name="checkInDateTo"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-3"
                            value={checkInDateTo}
                            onChange={(e) => setCheckInDateTo(e.target.value)}
                            min={checkInDateFrom || undefined} 
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="checkOutDateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date From
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                        </div>
                        <input
                            type="date"
                            id="checkOutDateFrom"
                            name="checkOutDateFrom"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-3"
                            value={checkOutDateFrom}
                            onChange={(e) => setCheckOutDateFrom(e.target.value)}
                            min={checkInDateFrom || undefined} 
                            max={checkOutDateTo || undefined} 
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="checkOutDateTo" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date To
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                        </div>
                        <input
                            type="date"
                            id="checkOutDateTo"
                            name="checkOutDateTo"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-3"
                            value={checkOutDateTo}
                            onChange={(e) => setCheckOutDateTo(e.target.value)}
                            min={checkOutDateFrom || checkInDateFrom || undefined} 
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={generateReport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
                Submit
            </button>

            {/* Error Message */}
            {reportError && <p className="text-red-600 mt-4 text-sm">{reportError}</p>}

            {/* Report Table Area */}
            <div className="mt-8"> 
                {reportData.length > 0 ? (
                    <>
                        <div className="overflow-x-auto border border-gray-200 rounded-md">
                             <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-200"> 
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hotel Name</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Booking Ref</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Room Numbers</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check-in</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check-out</th>
                                        <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Days</th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Total Price</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map((reportItem) => (
                                        <tr key={reportItem._id || reportItem.bookingId} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{reportItem.hotelName || '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reportItem.bookingId || '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {Array.isArray(reportItem.allRoomIds)
                                                    ? reportItem.allRoomIds.map(id => availableRooms.find(room => String(room._id) === String(id))?.roomNumber || '?').join(', ')
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reportItem.checkInDate ? moment(reportItem.checkInDate).format('YYYY-MM-DD') : '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{reportItem.checkOutDate ? moment(reportItem.checkOutDate).format('YYYY-MM-DD') : '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{reportItem.daysStayed != null ? reportItem.daysStayed : '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right">{reportItem.totalPrice != null ? `Rs ${reportItem.totalPrice.toLocaleString()}` : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                         {/* Download Button */}
                         <button
                            onClick={downloadPdfReport}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mt-6 transition duration-150 ease-in-out inline-flex items-center"
                            disabled={downloadingPdf}
                        >
                            {downloadingPdf ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    !reportError && (
                         <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-md mt-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No report data</h3>
                            <p className="mt-1 text-sm text-gray-500">No data matches your filter criteria. Adjust filters and click Submit.</p>
                         </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Reports;


