import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const Report = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, destinationsRes] = await Promise.all([
          fetch('http://localhost:5000/api/bookings/'),
          fetch('http://localhost:5000/api/admin-destinations'),
        ]);

        const bookingsData = await bookingsRes.json();
        const destinationsData = await destinationsRes.json();

        if (!bookingsRes.ok || !destinationsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        setBookings(bookingsData.data);
        setDestinations(destinationsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilter = () => {
    let filteredData = bookings;

    if (destination) {
      filteredData = filteredData.filter((booking) =>
        booking.destination?.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (date) {
      const selectedDate = new Date(date).toLocaleDateString();
      filteredData = filteredData.filter((booking) => 
        new Date(booking.date).toLocaleDateString() === selectedDate
      );
    }

    setFilteredBookings(filteredData);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Report', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(59, 130, 246);
    doc.rect(10, 30, 190, 10, 'F');

    doc.text('Name', 15, 37);
    doc.text('Destination', 60, 37);
    doc.text('Date', 120, 37);
    doc.text('People', 160, 37);
    doc.text('Price', 180, 37);

    let y = 45;
    filteredBookings.forEach((booking, index) => {
      doc.setTextColor(0, 0, 0);
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.rect(10, y - 5, 190, 8, 'F');

      doc.text(booking.name, 15, y);
      doc.text(booking.destination, 60, y);
      doc.text(new Date(booking.date).toLocaleDateString(), 120, y);
      doc.text(booking.people.toString(), 160, y);
      doc.text(`$${booking.price}`, 180, y);

      y += 10;
    });

    doc.save('Booking_Report.pdf');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Booking Report</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Destinations</option>
              {destinations.map((dest) => (
                <option key={dest._id} value={dest.name}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={handleFilter}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition"
          >
            Apply Filters
          </button>

          {filteredBookings.length > 0 && (
            <button
              onClick={downloadPDF}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition"
            >
              Download PDF
            </button>
          )}
        </div>

        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-md">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Destination</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">People</th>
                  <th className="py-3 px-4 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-t hover:bg-gray-100">
                    <td className="py-3 px-4">{booking.name}</td>
                    <td className="py-3 px-4">{booking.destination}</td>
                    <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{booking.people}</td>
                    <td className="py-3 px-4">${booking.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">No bookings found for the selected filters.</div>
        )}
      </div>
    </div>
  );
};

export default Report;
