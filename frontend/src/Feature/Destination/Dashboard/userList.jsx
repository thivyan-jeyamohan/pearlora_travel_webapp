import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/bookings")
      .then((response) => {
        setBookings(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ API Error:", error);
        setError("Error fetching booking data");
        setLoading(false);
      });
  }, []);

  // Search Filter
  const filteredBookings = bookings.filter((booking) =>
    (booking.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort Filter
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOption === "oldest") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOption === "highest") {
      return (b.price * b.people) - (a.price * a.people);
    } else if (sortOption === "lowest") {
      return (a.price * a.people) - (b.price * b.people);
    }
    return 0;
  });

  // Download CSV
  const handleDownloadCSV = () => {
    const csvRows = [
      ["Name", "Email", "Destination", "Date", "People", "Total Price"], // headers
      ...sortedBookings.map((b) => [
        b.name,
        b.email,
        b.destination,
        new Date(b.date).toLocaleDateString(),
        b.people,
        (b.price * b.people).toFixed(2), // Formatting total price with 2 decimals
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
          📋 Booking List
        </h2>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full md:w-1/4 p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort By</option>
            <option value="latest">🔃 Latest</option>
            <option value="oldest">🕰️ Oldest</option>
            <option value="highest">💰 Highest Price</option>
            <option value="lowest">🔻 Lowest Price</option>
          </select>

          {/* Download CSV */}
          <button
            onClick={handleDownloadCSV}
            className="w-full md:w-1/4 p-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl"
          >
            📥 Download CSV
          </button>
        </div>

        {/* Total Bookings */}
        <div className="text-right text-gray-700 font-semibold mb-4">
          📋 Total Bookings: {sortedBookings.length}
        </div>

        {/* Booking Cards */}
        {sortedBookings.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-transform hover:-translate-y-2 duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-700 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A5.003 5.003 0 0112 15h0a5.003 5.003 0 016.879 2.804M15 11a3 3 0 00-6 0m6 0a3 3 0 11-6 0m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{booking.name || "Unknown"}</h3>
                    <p className="text-gray-500 text-sm">{booking.email || "No email"}</p>
                  </div>
                </div>

                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Destination:</span> {booking.destination || "Unknown"}</p>
                  <p><span className="font-semibold">Date:</span> {booking.date ? new Date(booking.date).toLocaleDateString() : "Unknown"}</p>
                  <p><span className="font-semibold">People:</span> {booking.people || 0}</p>
                  <p className="text-green-600 font-bold text-lg">
                    <span className="font-semibold">Total Price:</span> ${booking.price && booking.people ? (booking.price * booking.people).toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
