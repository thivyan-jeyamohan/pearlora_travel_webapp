import React, { useState, useEffect } from 'react';
import API from './services/api'; 
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faDownload, faSearch } from '@fortawesome/free-solid-svg-icons'; 
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from './images/logo.png'; 

const Reports = () => {
    
    const [reportData, setReportData] = useState([]);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [hotelId, setHotelId] = useState(''); 
    const [roomId, setRoomId] = useState('');  
    const [searchTerm, setSearchTerm] = useState(''); 
    const [reportError, setReportError] = useState('');
    const [hotels, setHotels] = useState([]); 
    const [availableRooms, setAvailableRooms] = useState([]); 
    const [filteredRooms, setFilteredRooms] = useState([]); 
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 
    const [hasSearched, setHasSearched] = useState(false); 

    // Fetch Initial Data 
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [hotelsRes, roomsRes] = await Promise.all([
                    API.get('/hotels'),
                    API.get('/rooms')
                ]);
                setHotels(hotelsRes.data || []);
                setAvailableRooms(roomsRes.data || []);
                setReportError('');
            } catch (error) {
                console.error("Error fetching initial data:", error);
                setReportError("Could not load initial hotel or room data. Please try refreshing.");
                setHotels([]);
                setAvailableRooms([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Filter Rooms 
    useEffect(() => {
        if (hotelId && Array.isArray(availableRooms)) {
            const filtered = availableRooms.filter(room => String(room.hotelId) === String(hotelId));
            setFilteredRooms(filtered);
        } else {
            setFilteredRooms([]);
        }
        setRoomId(''); 
    }, [hotelId, availableRooms]);

    //Date Validation
    useEffect(() => {
        if (checkInDate && checkOutDate && moment(checkOutDate).isSameOrBefore(checkInDate)) {
            setCheckOutDate('');
        }
    }, [checkInDate, checkOutDate]);
    
      

    //Generate Report
    const generateReport = async () => {
        setIsLoading(true);
        setReportError('');
        setReportData([]);
        setHasSearched(true);
    
        try {
            const params = new URLSearchParams();
    
            
            if (searchTerm.trim()) params.append('searchTerm', searchTerm.trim());
    
            if (hotelId) params.append('hotelId', hotelId);
            if (roomId) params.append('roomId', roomId);
    
            if (checkInDate) params.append('checkInDate', `${checkInDate}T14:00:00`);
            if (checkOutDate) params.append('checkOutDate', `${checkOutDate}T12:00:00`);

    
            console.log("Generating report with params:", params.toString());
    
            const response = await API.get(`/reports?${params.toString()}`);
            const data = response.data || [];
            setReportData(data);
    
            if (data.length === 0) {
                setReportError("No bookings found matching the criteria.");
            }
    
        } catch (error) {
            console.error("Error fetching report:", error.response?.data || error);
            setReportData([]);
            setReportError(error.response?.data?.message || "Failed to generate report. Please check filters or server logs.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Download Report
    const downloadPdfReport = async () => {
        if (!Array.isArray(reportData) || reportData.length === 0) {
            setReportError('No data available to download the report.');
            return;
        }

        setDownloadingPdf(true);
        setReportError('');

        try {
            const doc = new jsPDF();
            doc.setFont("helvetica", "bold");

            try {
                if (logo) {
                    doc.addImage(logo, "PNG", 14, 10, 30, 30);
                } else {
                     doc.setFontSize(9); doc.text("[No Logo]", 14, 15);
                }
            } catch (imgError) {
                console.error("Error adding logo to PDF:", imgError);
                doc.setFontSize(9); doc.text("[Logo Error]", 14, 15);
            }
            doc.setFont("helvetica", "bold");

            doc.setFontSize(20);
            const title = "Hotel Booking Report".toUpperCase();
            doc.text(title, 105, 25, { align: 'center' });

            const tableColumn = [
                "Hotel Name", "Booking Ref", "Room Num(s)", "Check-in", "Check-out", "Days", "Price (LKR)"
            ];

            const grandTotalAmount = reportData.reduce((sum, item) => {
                const price = Number(item.totalPrice) || 0;
                return sum + price;
            }, 0);
            const formattedGrandTotal = grandTotalAmount.toFixed(2);

            const tableRows = reportData.map(item => {
                 let roomNumbers = 'N/A';
                 if (Array.isArray(item.allRoomIds) && Array.isArray(availableRooms)) {
                    roomNumbers = item.allRoomIds
                        .map(roomIdStr => availableRooms.find(room => String(room?._id) === String(roomIdStr))?.roomNumber || '?')
                        .join(", ") || 'N/A';
                 }

                 const individualPrice = Number(item.totalPrice) || 0;
                 return [
                     item.hotelName || 'N/A',
                     item.bookingId || 'N/A', 
                     roomNumbers,
                     item.checkInDate ? moment(item.checkInDate).format("YYYY-MM-DD") : 'N/A',
                     item.checkOutDate ? moment(item.checkOutDate).format("YYYY-MM-DD") : 'N/A',
                     item.daysStayed != null ? item.daysStayed : 'N/A',
                     individualPrice.toFixed(2)
                 ];
             });

             const tableFooter = [
                [
                    { content: `Grand Total:`, colSpan: tableColumn.length - 1, styles: { halign: 'right', fontStyle: 'bold', fillColor: [220, 220, 220] } },
                    { content: `LKR ${formattedGrandTotal}`, styles: { halign: 'right', fontStyle: 'bold', fillColor: [220, 220, 220] } },
                ]
            ];

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                foot: tableFooter,
                startY: 50,
                theme: 'grid',
                headStyles: { fillColor: [82, 2, 153], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', valign: 'middle' },
                bodyStyles: { textColor: [0, 0, 0], valign: 'middle' },
                footStyles: {
                    fontStyle: 'bold',
                    textColor: [0, 0, 0],       
                    fillColor: [220, 220, 220], 
                    lineWidth: { top: 0.5 },
                    lineColor: [44, 62, 80],    
                  },
                didParseCell: function (data) {
                     if (data.section === 'body' || data.section === 'foot') {
                          const numericCols = [5, 6]; // Index for Days, Price
                          if (numericCols.includes(data.column.index)) data.cell.styles.halign = 'right';
                          if ([2, 3, 4].includes(data.column.index) && data.section === 'body') data.cell.styles.halign = 'center'; 
                     }
                 },
                margin: { top: 45, bottom: 40, left: 14, right: 14 },
            });

            const finalY = doc.lastAutoTable.finalY;
            const generatedDate = new Date().toLocaleString();
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Generated on: ${generatedDate}`, 105, finalY + 15, { align: 'center' });
            doc.text("Generated By: Hotel Manager - Kesigan Mukuntharathan", 105, finalY + 22, { align: 'center' });

            doc.save("hotel_booking_report.pdf");

            //Reset state after download 
            setReportData([]); 
            setCheckInDate('');
            setCheckOutDate('');
            setHotelId('');
            setRoomId('');
            setSearchTerm(''); 
            setReportError('');

        } catch (error) {
            console.error("Error generating and downloading PDF:", error);
            setReportError(`Failed to generate PDF: ${error.message || 'Unknown error'}`);
        } finally {
            setDownloadingPdf(false);
        }
    };

    
    return (
            <div className="p-4 md:p-6 bg-white rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">Generate Booking Report</h2>

            {/* Search Bar  */}
            <div className="mb-6 w-148">
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                Search (Booking ID / Hotel Name)
                </label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 h-5 w-5" />
                </div>
                <input
                    type="text"
                    id="searchTerm"
                    name="searchTerm"
                    className="block w-full pl-10 p-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter Booking ID or Hotel Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />
                </div>
            </div>

            {/* Hotel and Room filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                
                <div>
                <label htmlFor="hotelId" className="block text-sm font-medium text-gray-700 mb-1">Filter by Hotel</label>
                <select
                    id="hotelId"
                    name="hotelId"
                    className="block w-full p-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={hotelId}
                    onChange={(e) => setHotelId(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">All Hotels</option>
                    {hotels.length > 0 ? hotels.map(hotel => (
                    <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                    )) : <option disabled>Loading...</option>}
                </select>
                </div>

                
                <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">Filter by Room</label>
                <select
                    id="roomId"
                    name="roomId"
                    className="block w-full p-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    disabled={isLoading || !hotelId || filteredRooms.length === 0}
                >
                    <option value="">All Rooms in Selected Hotel</option>
                    {hotelId && filteredRooms.length > 0 ? (
                    filteredRooms.map(room => (
                        <option key={room._id} value={room._id}>{room.roomNumber}</option>
                    ))
                    ) : hotelId ? (
                    <option disabled>No rooms available</option>
                    ) : (
                    <option disabled>Select hotel first</option>
                    )}
                </select>
                </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Check-in Date */}
                <div>
                <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faCalendar} className="text-gray-400 h-5 w-5" />
                    </div>
                    <input
                    type="date"
                    id="checkInDate"
                    name="checkInDate"
                    className="block w-full pl-10 p-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    disabled={isLoading}
                    />
                </div>
                </div>

                {/* Check-out Date */}
                <div>
                <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faCalendar} className="text-gray-400 h-5 w-5" />
                    </div>
                    <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    className="block w-full pl-10 p-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || moment().format("YYYY-MM-DD")}
                    disabled={isLoading || !checkInDate}
                    />
                </div>
                </div>
            </div>



            <button
                onClick={generateReport}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out mb-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? 'Generating...' : 'Submit Filters'}
            </button>

            {/* Error Message Display */}
            {reportError && (
                 <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm" role="alert">
                     {reportError}
                 </div>
            )}

            {/* Report Table Area */}
            <div className="mt-8">
                {reportData.length > 0 && !isLoading ? (
                    <>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
                             <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hotel</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Booking Ref</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Room(s)</th>
                                        <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Check-in</th>
                                        <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Check-out</th>
                                        <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Days</th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Price (Rs)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map((item) => (
                                        <tr key={item._id || item.bookingId} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{item.hotelName || '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">{item.bookingId || '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {Array.isArray(item.allRoomIds) && Array.isArray(availableRooms)
                                                    ? item.allRoomIds.map(id => availableRooms.find(room => String(room?._id) === String(id))?.roomNumber || '?').join(', ')
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{item.checkInDate ? moment(item.checkInDate).format('YYYY-MM-DD') : '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{item.checkOutDate ? moment(item.checkOutDate).format('YYYY-MM-DD') : '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{item.daysStayed != null ? item.daysStayed : '-'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right font-medium">
                                                {item.totalPrice != null ? `LKR ${Number(item.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                         <button
                            onClick={downloadPdfReport}
                            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mt-6 transition duration-150 ease-in-out inline-flex items-center ${downloadingPdf || isLoading || reportData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={downloadingPdf || isLoading || reportData.length === 0}
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
                     hasSearched && !reportError && !isLoading && ( 
                         <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-md mt-8 bg-gray-50">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No Results Found</h3>
                            <p className="mt-1 text-sm text-gray-500">No bookings matched your current filter criteria.</p>
                         </div>
                    )
                )}
                 { !hasSearched && !isLoading && !reportError && ( 
                    <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-md mt-8 bg-gray-50">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                            </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Generate a Report</h3>
                        <p className="mt-1 text-sm text-gray-500">Use the filters above and click Submit Filters to view booking data.</p>
                    </div>
                 )}
                 {isLoading && ( 
                    <div className="text-center py-10 px-4 mt-8">
                         <svg className="animate-spin mx-auto h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         <p className="mt-2 text-sm text-gray-500">Generating report...</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default Reports;