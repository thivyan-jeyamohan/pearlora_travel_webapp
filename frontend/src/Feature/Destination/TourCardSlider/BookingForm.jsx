import React, { useState } from "react";
import axios from "axios";

const BookingForm = () => {
  const destinations = [
    { id: 1, name: "Sigiriya Rock Fortress", price: 150 },
    { id: 2, name: "Ella", price: 120 },
    { id: 3, name: "Yala National Park", price: 180 },
    { id: 4, name: "Galle Fort", price: 100 },
    { id: 5, name: "Kandy Temple of the Tooth", price: 140 },
    { id: 6, name: "Nuwara Eliya", price: 130 },
    { id: 7, name: "Mirissa Beach", price: 110 },
    { id: 8, name: "Horton Plains", price: 160 },
  ];

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    date: "",
    people: 1,
    destination: destinations[0].name,
    price: destinations[0].price,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });

    if (name === "destination") {
      const selected = destinations.find((d) => d.name === value);
      setBooking({ ...booking, destination: value, price: selected.price });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/bookings", booking);
      alert(response.data.message);
    } catch (error) {
      alert("Error saving booking");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Book Your Destination ✈️</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input type="text" name="name" value={booking.name} onChange={handleChange} required className="w-full p-3 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input type="email" name="email" value={booking.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Select Destination</label>
            <select name="destination" value={booking.destination} onChange={handleChange} className="w-full p-3 border rounded-md">
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.name}>
                  {dest.name} - ${dest.price} per person
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Select Date</label>
            <input type="date" name="date" value={booking.date} onChange={handleChange} required className="w-full p-3 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Number of People</label>
            <input type="number" name="people" min="1" value={booking.people} onChange={handleChange} required className="w-full p-3 border rounded-md" />
          </div>
          <div className="text-lg font-bold text-center">
            Total Price: <span className="text-blue-600">${booking.price * booking.people}</span>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md">Confirm Booking ✅</button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
