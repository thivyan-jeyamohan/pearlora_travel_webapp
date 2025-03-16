import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyCH4lsu_OdnUIyGdYX-yz5qQIZLS7KvFdI";
const LIBRARIES = ["places"]; // ✅ Declared outside the component

const BasicRide = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setPickupLocation(place.formatted_address);
      }
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isVehicleDisabled = (vehicle) => {
    if (passengerCount >= 8) return ["Bike", "Three-Wheeler", "Car", "Van"].includes(vehicle);
    if (passengerCount >= 6) return ["Bike", "Three-Wheeler", "Car"].includes(vehicle);
    if (passengerCount >= 4) return ["Bike", "Three-Wheeler"].includes(vehicle);
    if (passengerCount >= 3) return ["Bike"].includes(vehicle);
    return false;
  };

  const validateBookingTime = () => {
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    return selectedDateTime > now && selectedDateTime - now >= 30 * 60 * 1000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateBookingTime() && validateEmail(email) && pickupLocation && selectedVehicle) {
      try {
        const response = await axios.post("http://localhost:5000/api/rides/book-ride", {
          pickupLocation,
          email,
          passengerCount,
          selectedDate,
          selectedTime,
          vehicleType: selectedVehicle
        });
        alert(response.data.message);
        setPickupLocation("");
        setPassengerCount(1);
        setEmail("");
        setSelectedDate("");
        setSelectedTime("");
        setSelectedVehicle("");
      } catch (error) {
        alert("Failed to book ride. Please try again!");
      }
    } else {
      alert("Please fill in all required fields correctly!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Book Your Ride 🚗</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Pickup Location</label>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
            <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceSelect}>
              <input
                type="text"
                className="w-full p-3 border rounded-md"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter a location"
                required
              />
            </Autocomplete>
          </LoadScript>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          {!validateEmail(email) && email.length > 0 && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Number of Passengers</label>
          <input
            type="number"
            className="w-full p-3 border rounded-md"
            min="1"
            max="10"
            value={passengerCount}
            onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
            required
          />
        </div>

        <div className="flex gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-2">Trip Date</label>
            <input
              type="date"
              className="p-3 border rounded-md"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Trip Time</label>
            <input
              type="time"
              className="p-3 border rounded-md"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block font-semibold mb-4">Select Vehicle</label>
          <div className="flex gap-4">
            {["Bike", "Three-Wheeler", "Car", "Van", "Bus"].map((vehicle) => (
              <button
                key={vehicle}
                type="button"
                onClick={() => setSelectedVehicle(vehicle)}
                className={`p-4 rounded-lg font-semibold ${
                  isVehicleDisabled(vehicle)
                    ? "bg-gray-300 cursor-not-allowed"
                    : selectedVehicle === vehicle
                    ? "bg-green-500 text-white"
                    : "bg-purple-600 text-white"
                }`}
                disabled={isVehicleDisabled(vehicle)}
              >
                {vehicle}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-3 rounded-lg font-bold text-lg"
          disabled={!validateBookingTime() || !validateEmail(email) || !pickupLocation || !selectedVehicle}
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BasicRide;
