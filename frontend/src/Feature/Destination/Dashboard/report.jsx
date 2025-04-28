import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const Report = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);

  // Fetch bookings and destinations from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings/');
        const data = await response.json();

        if (response.ok) {
          setBookings(data.data);
          console.log('Bookings Data:', data.data);  // Log the bookings data
        } else {
          throw new Error(data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin-destinations');
        const data = await response.json();

        if (response.ok) {
          setDestinations(data);
          console.log('Destinations Data:', data);  // Log the destinations data
        } else {
          throw new Error(data.message || 'Failed to fetch destinations');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookings();
    fetchDestinations();
  }, []);

  // Handle filtering
  const handleFilter = () => {
    console.log('Filter Values:', destination, date);  // Log filter values
  
    let filteredData = bookings;
  
    // Filter by destination if provided
    if (destination) {
      filteredData = filteredData.filter((booking) => {
        // Check if the booking.destination is a valid string before calling .toLowerCase() and .trim()
        const cleanedDestination = (booking.destination && typeof booking.destination === 'string') 
          ? booking.destination.toLowerCase().trim() 
          : '';

        const cleanedInput = destination.toLowerCase().trim();

        console.log('Comparing:', cleanedDestination, cleanedInput);  // Log both for debugging

        // Check if the cleaned destination matches the cleaned input
        return cleanedDestination.includes(cleanedInput);
      });
    }
  
    // Filter by date if provided
    if (date) {
      const filterDate = new Date(date);
      console.log('Filter Date:', filterDate);  // Log the filter date
  
      filteredData = filteredData.filter((booking) => {
        const bookingDate = new Date(booking.date);
        console.log('Booking Date:', bookingDate);  // Log the booking date
  
        return bookingDate.toLocaleDateString() === filterDate.toLocaleDateString();
      });
    }
  
    console.log('Filtered Data:', filteredData);  // Log the filtered data
  
    setFilteredBookings(filteredData);
  };

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Report', 105, 20, { align: 'center' });

    // Add Table headers with bold and color
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(56, 189, 248);  // Tailwind blue-500
    doc.rect(14, 30, 190, 10, 'F'); // Header background

    doc.setTextColor(255, 255, 255);
    doc.text('Name', 14, 35);
    doc.text('Email', 60, 35);
    doc.text('Destination', 120, 35);
    doc.text('Date', 170, 35);
    doc.text('People', 210, 35);
    doc.text('Price', 250, 35);

    // Add Table rows with alternating colors
    let yPosition = 40; // Start adding data from this vertical position
    let rowIndex = 0;

    filteredBookings.forEach((booking) => {
      // Alternate row colors for better readability
      if (rowIndex % 2 === 0) {
        doc.setFillColor(249, 250, 251); // Light gray (tailwind bg-gray-100)
      } else {
        doc.setFillColor(255, 255, 255); // White
      }

      // Add row background color
      doc.rect(14, yPosition, 190, 10, 'F');

      // Add text for the row
      doc.setTextColor(0, 0, 0); // Black text
      doc.text(booking.name, 14, yPosition + 6);
      doc.text(booking.email, 60, yPosition + 6);
      doc.text(booking.destination, 120, yPosition + 6);
      doc.text(new Date(booking.date).toLocaleDateString(), 170, yPosition + 6);
      doc.text(booking.people.toString(), 210, yPosition + 6);
      doc.text(`$${booking.price.toFixed(2)}`, 250, yPosition + 6);

      yPosition += 10; // Move to the next line
      rowIndex++;
    });

    // Save the document as a PDF
    doc.save('bookings_report.pdf');
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Booking Report</h1>

        <form className="space-y-6">
          {/* Destination Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Select Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Destination</option>
              {destinations.map((dest) => (
                <option key={dest._id} value={dest.name}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleFilter}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 mt-2"
            >
              Apply Filters
            </button>
            <button
              onClick={downloadPDF}
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300 mt-2"
            >
              Download PDF
            </button>
          </div>
        </form>

        {/* Display Bookings */}
        {filteredBookings.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h3>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="border-b py-4">
                  <p className="text-gray-800"><strong>Name:</strong> {booking.name}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {booking.email}</p>
                  <p className="text-gray-600"><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-gray-600"><strong>People:</strong> {booking.people}</p>
                  <p className="text-gray-600"><strong>Destination:</strong> {booking.destination}</p>
                  <p className="text-gray-600"><strong>Price:</strong> ${booking.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
