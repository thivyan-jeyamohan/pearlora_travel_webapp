import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/bookings")
      .then((response) => {
        setBookings(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ API Error:", error);
        setError("Error fetching booking data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Booking List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="border-b pb-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{booking.name}</h3>
            </div>
            <div className="text-gray-700 mb-2">
              <strong>Email:</strong> {booking.email}
            </div>
            <div className="text-gray-700 mb-2">
              <strong>Destination:</strong> {booking.destination}
            </div>
            <div className="text-gray-700 mb-2">
              <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
            </div>
            <div className="text-gray-700 mb-2">
              <strong>People:</strong> {booking.people}
            </div>
            <div className="text-gray-700 font-bold">
              <strong>Total Price:</strong> ${booking.price * booking.people}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
