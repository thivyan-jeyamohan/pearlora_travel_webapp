import React, { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';
import bikeImg from '../../../assets/bike.png';
import threeWheelerImg from '../../../assets/three-wheeler.png';
import carImg from '../../../assets/Car.png';
import vanImg from '../../../assets/van.png';
import AirtaxiImg from '../../../assets/airtaxiimg.png';
import location from "../../../assets/locationdigi.jpg";
import { QRCodeSVG } from 'qrcode.react';

const vehicleImages = {
  Bike: bikeImg,
  ThreeWheeler: threeWheelerImg,
  Car: carImg,
  Van: vanImg,
  AirTaxi: AirtaxiImg,
};

const GOOGLE_MAPS_API_KEY = 'AIzaSyCH4lsu_OdnUIyGdYX-yz5qQIZLS7KvFdI';
const LIBRARIES = ['places'];

const BasicRide = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [email, setEmail] = useState('');
  const [selectedDateTimeString, setSelectedDateTimeString] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [qrValue, setQrValue] = useState('');


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
    if (passengerCount >= 8) return ['Bike', 'ThreeWheeler', 'Car', 'Van', 'AirTaxi'].includes(vehicle);
    if (passengerCount >= 6) return ['Bike', 'ThreeWheeler', 'Car', 'AirTaxi'].includes(vehicle);
    if (passengerCount >= 5) return ['Bike', 'ThreeWheeler', 'Car'].includes(vehicle);
    if (passengerCount >= 4) return ['Bike', 'ThreeWheeler'].includes(vehicle);
    if (passengerCount >= 3) return ['Bike'].includes(vehicle);
    return false;
  };

  const validateBookingTime = () => {
    const now = new Date();
    const selectedDateTime = new Date(selectedDateTimeString);
    return selectedDateTime > now && selectedDateTime - now >= 30 * 60 * 1000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateBookingTime() && validateEmail(email) && pickupLocation && selectedVehicle) {
      try {
        const response = await axios.post('http://localhost:5000/api/rides/book-ride', {
          pickupLocation,
          email,
          passengerCount,
          selectedDateTime: selectedDateTimeString,
          vehicleType: selectedVehicle,
        });

        const bookingInfo = {
          pickupLocation,
          email,
          passengerCount,
          selectedDateTime: selectedDateTimeString,
          selectedVehicle,
          message: response.data.message,
        };

        const qrText =
  "Booking Confirmation\n" +
  "------------------------------------------\n" +
  `Pickup Location : ${pickupLocation}\n` +
  `Email           : ${email}\n` +
  `Passengers      : ${passengerCount}\n` +
  `Date & Time     : ${selectedDateTimeString}\n` +
  `Vehicle         : ${selectedVehicle}\n` +
  `Message         : ${response.data.message}`;

        
                setQrValue(qrText.trim());
                setBookingData(bookingInfo);
                setBookingConfirmed(true);

        setPickupLocation('');
        setPassengerCount(1);
        setEmail('');
        setSelectedDateTimeString('');
        setSelectedVehicle('');
      } catch (error) {
        alert('Failed to book ride. Please try again!');
      }
    } else {
      alert('Please fill in all required fields correctly!');
    }
  };

  const closeModal = () => {
    setBookingConfirmed(false);
  };

  return (
    <div className="bg-blue-50 p-6 sm:p-10 md:p-20">
      <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-[32px] p-5">
        <div className="w-full sm:w-3/4 mx-auto p-8 text-black">
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

            <div>
              <label className="block font-semibold mb-2">Trip Date and Time</label>
              <input
                type="datetime-local"
                className="p-3 border rounded-md text-black"
                min={new Date(new Date().getTime() + 15 * 60000).toISOString().slice(0, 16)} // 15 minutes from now
                value={selectedDateTimeString}
                onChange={(e) => setSelectedDateTimeString(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-4">Select Vehicle</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {['Bike', 'ThreeWheeler', 'Car', 'AirTaxi', 'Van'].map((vehicle) => (
                  <button
                    key={vehicle}
                    type="button"
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`flex flex-col items-center p-4 rounded-lg font-semibold transition-transform transform hover:scale-110 ${isVehicleDisabled(vehicle)
                        ? 'bg-gray-300 cursor-not-allowed'
                        : selectedVehicle === vehicle
                          ? 'bg-green-500 text-white'
                          : 'bg-violet-400 text-white'}`}
                    disabled={isVehicleDisabled(vehicle)}
                  >
                    <img
                      src={vehicleImages[vehicle]}
                      alt={vehicle}
                      className="w-20 h-20 object-contain mb-2"
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

        <div className="w-full sm:w-1/2 mt-6 sm:mt-0">
          <img className="rounded-[28px] w-full h-auto" src={location} alt="Location" />
        </div>
      </div>

      {/* Modal for QR Code */}
      {bookingConfirmed && bookingData && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded-xl text-center">
            <h3 className="text-2xl font-semibold mb-4">Booking Confirmed! 🎉</h3>
            <QRCodeSVG value={qrValue} size={256} />
            <p className="mt-4 text-lg font-semibold">Scan the QR code for booking details!</p>
            <button
              className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicRide;
