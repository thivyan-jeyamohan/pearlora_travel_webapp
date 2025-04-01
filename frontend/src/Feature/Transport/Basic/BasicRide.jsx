
import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import location from "../../../assets/locationdigi.jpg"
import bikeImg from "../../../assets/bike.png";
import threeWheelerImg from "../../../assets/three-wheeler.png";
import carImg from "../../../assets/Car.png";
import vanImg from "../../../assets/van.png";
import busImg from "../../../assets/bus.png";

const vehicleImages = {
  Bike: bikeImg,
  ThreeWheeler: threeWheelerImg,
  Car: carImg,
  Van: vanImg,
  Bus: busImg,
};


const GOOGLE_MAPS_API_KEY = "AIzaSyCH4lsu_OdnUIyGdYX-yz5qQIZLS7KvFdI";
const LIBRARIES = ["places"];


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
    if (passengerCount >= 8) return ["Bike", "ThreeWheeler", "Car", "Van"].includes(vehicle);
    if (passengerCount >= 6) return ["Bike", "ThreeWheeler", "Car"].includes(vehicle);
    if (passengerCount >= 4) return ["Bike", "ThreeWheeler"].includes(vehicle);
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
          vehicleType: selectedVehicle,
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
    <div className="bg-blue-50 p-20">
      <div className="flex bg-white shadow-lg rounded-[32px] p-5 ">
        <div className="w-3/4 mx-auto p-8  text-black   ">
          <h2 className="text-4xl font-extrabold mb-6 text-center">Book Your Ride 🚗</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Pickup Location</label>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
                <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceSelect}>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-md text-black"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Enter a location"
                    required
                  />
                </Autocomplete>
             </LoadScript>
            </div>

            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-md text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              {!validateEmail(email) && email.length > 0 && (
                <p className="text-red-400 text-sm mt-1">Please enter a valid email address.</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2">Number of Passengers</label>
              <input
                type="number"
                className="w-full p-3 border rounded-md text-black"
                min="1"
                max="10"
                value={passengerCount}
                onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                required
              />
            </div>    

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Trip Date</label>
                <input
                  type="date"
                  className="p-3 border rounded-md text-black"
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
                  className="p-3 border rounded-md text-black"
                  min={new Date(new Date().getTime() + 15 * 60000).toISOString().slice(11, 16)}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  onBlur={(e) => {
                    const selectedTime = e.target.value;
                    const currentTime = new Date();
                    const minTime = new Date(currentTime.getTime() + 15 * 60000); // 15 minutes from now
                    const selectedTimeObj = new Date(`${currentTime.toDateString()} ${selectedTime}`);
                
                    if (selectedTimeObj < minTime) {
                      alert("Please select a time that is at least 15 minutes from now.");
                    }
                  }}
                  required
                />
              </div>

            </div>

            <div>
              <label className="block font-semibold mb-4">Select Vehicle</label>
              <div className="flex gap-4">
              {["Bike", "ThreeWheeler", "Car", "Van", "Bus"].map((vehicle) => (
                <button
                  key={vehicle}
                  type="button"
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`flex flex-col items-center p-4 rounded-lg font-semibold transition-transform transform hover:scale-110 ${
                    isVehicleDisabled(vehicle)
                      ? "bg-gray-300 cursor-not-allowed"
                      : selectedVehicle === vehicle
                      ? "bg-green-500 text-white"
                      : "bg-violet-400 text-white"
                  }`}
                  disabled={isVehicleDisabled(vehicle)}
                >
                  <img
                    src={vehicleImages[vehicle]} 
                    alt={vehicle}
                    className="w-25 h-25 object-contain mb-2"
                  />
                  
                </button>
              ))}
            </div>

            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-violet-900 transition-all"
              disabled={!validateBookingTime() || !validateEmail(email) || !pickupLocation || !selectedVehicle}
            >
              Book Now
            </button>

          </form>
        </div>
        <div className="w-1/2 ">
          <img className="rounded-[28px]" src={location}/>
        </div>

      </div>
    </div>
  );
};

export default BasicRide;