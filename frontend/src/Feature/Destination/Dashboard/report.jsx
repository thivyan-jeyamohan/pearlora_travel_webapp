import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const Report = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings/');
        const data = await response.json();

        if (response.ok) {
          setBookings(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookings();
  }, []);

  // Get unique destinations from the bookings
  const destinations = [...new Set(bookings.map((booking) => booking.destination))];

  const handleFilter = () => {
    let filteredData = bookings;

    if (destination) {
      filteredData = filteredData.filter((booking) =>
        booking.destination.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (date) {
      const filterDate = new Date(date);
      filteredData = filteredData.filter((booking) =>
        new Date(booking.date).toLocaleDateString() === filterDate.toLocaleDateString()
      );
    }

    setFilteredBookings(filteredData);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text('Booking Report', 14, 20);

    // Add Table headers
    doc.setFontSize(12);
    doc.text('Name', 14, 30);
    doc.text('Email', 60, 30);
    doc.text('Destination', 120, 30);
    doc.text('Date', 170, 30);
    doc.text('People', 210, 30);
    doc.text('Price', 250, 30);

    // Add Table rows
    let yPosition = 40; // Start adding data from this vertical position

    filteredBookings.forEach((booking) => {
      doc.text(booking.name, 14, yPosition);
      doc.text(booking.email, 60, yPosition);
      doc.text(booking.destination, 120, yPosition);
      doc.text(new Date(booking.date).toLocaleDateString(), 170, yPosition);
      doc.text(booking.people.toString(), 210, yPosition);
      doc.text(`$${booking.price.toFixed(2)}`, 250, yPosition);

      yPosition += 10; // Move to the next line
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
                <option key={dest} value={dest}>
                  {dest}
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

          {/* Error Message */}
          {error && <div className="text-red-500 text-center">{error}</div>}

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
