import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import { MdCancel, MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { BsSave2 } from "react-icons/bs";
import axios from "axios";
import jeep from "../../../assets/jeep.png";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 6.9271, // Colombo, Sri Lanka
  lng: 79.8612,
};

const GOOGLE_MAPS_API_KEY = "AIzaSyCH4lsu_OdnUIyGdYX-yz5qQIZLS7KvFdI"; // Replace with your key
const LIBRARIES = ["places"];

const BasicRideHistory = () => {
  const [travels, setTravels] = useState([]);
  const [editingTravel, setEditingTravel] = useState(null);
  const [formData, setFormData] = useState({
    pickupLocation: "",
    passengerCount: 1,
    email: "",
    selectedDate: "",
    selectedTime: "",
    selectedVehicle: "",
  });
  const [pickupLocation, setPickupLocation] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);

  const vehicleOptions = [
    { name: "Bike", maxPassengers: 1 },
    { name: "Car", maxPassengers: 4 },
    { name: "Van", maxPassengers: 6 },
  ];

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rides/ridebookings");
      setTravels(response.data);
    } catch (error) {
      console.error("Error fetching travel details:", error);
    }
  };

  const handleEdit = (travel) => {
    setEditingTravel(travel._id);
    setFormData({
      pickupLocation: travel.pickupLocation,
      passengerCount: travel.passengerCount,
      email: travel.email,
      selectedDate: travel.selectedDate,
      selectedTime: travel.selectedTime,
      selectedVehicle: travel.vehicleType,
    });
    setPickupLocation(travel.pickupLocation);
  };

  const handlePlaceSelect = () => {
    const place = autocomplete.getPlace();
    if (place && place.formatted_address) {
      setPickupLocation(place.formatted_address);
      setFormData({ ...formData, pickupLocation: place.formatted_address });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const selectedVehicle = vehicleOptions.find(
      (vehicle) => vehicle.name === formData.selectedVehicle
    );

    if (selectedVehicle && formData.passengerCount > selectedVehicle.maxPassengers) {
      alert(`The selected vehicle (${selectedVehicle.name}) can only carry up to ${selectedVehicle.maxPassengers} passengers.`);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/rides/ridebookings/${editingTravel}`, { ...formData, pickupLocation });
      setEditingTravel(null);
      fetchTravels();
    } catch (error) {
      console.error("Error updating travel:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/rides/ridebookings/${id}`);
      fetchTravels();
    } catch (error) {
      console.error("Error deleting travel:", error);
    }
  };

  return (
    <div className="px-6">
      <div className="overflow-x-auto">
        {editingTravel ? (
          <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded-md shadow-md flex gap-10">
            <div className="w-1/2 py-15">
              <img src={jeep} alt="Vehicle" className="w-full h-auto" />
            </div>
            <div className="w-3/4">
              <div>
                <label className="block mb-2 text-sm font-semibold">Pickup Location</label>
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
                  <Autocomplete onLoad={(autocompleteInstance) => setAutocomplete(autocompleteInstance)} onPlaceChanged={handlePlaceSelect}>
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
                <label className="block mb-2 text-sm font-semibold">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border rounded-md" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold">Passenger Count</label>
                <input type="number" min="1" value={formData.passengerCount} onChange={(e) => setFormData({ ...formData, passengerCount: e.target.value })} className="w-full p-3 border rounded-md" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold">Date</label>
                <input type="date" value={formData.selectedDate} onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })} className="w-full p-3 border rounded-md" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold">Time</label>
                <input type="time" value={formData.selectedTime} onChange={(e) => setFormData({ ...formData, selectedTime: e.target.value })} className="w-full p-3 border rounded-md" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold">Vehicle Type</label>
                <select value={formData.selectedVehicle} onChange={(e) => setFormData({ ...formData, selectedVehicle: e.target.value })} className="w-full p-3 border rounded-md" required>
                  {vehicleOptions.map((vehicle) => (
                    <option key={vehicle.name} value={vehicle.name}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4 mt-4 justify-center">
                <button type="submit" className="bg-blue-800 text-white p-3 rounded-md">
                  <BsSave2 />
                </button>
                <button type="button" onClick={() => setEditingTravel(null)} className="bg-blue-500 text-white p-3 rounded-md">
                  <MdCancel />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <table className="min-w-full bg-white border border-gray-300 ">
            <thead >
              <tr className="bg-gray-200 ">
                <th className="border px-4 py-2">Pickup Location</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Passenger Count</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Vehicle</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
  {travels.map((travel) => (
    <tr key={travel._id} className="text-center">
      <td className="border px-4 py-2">{travel.pickupLocation}</td>
      <td className="border px-4 py-2">{travel.email}</td>
      <td className="border px-4 py-2">{travel.passengerCount}</td>
      <td className="border px-4 py-2">{travel.vehicleType}</td>
      <td className="border px-4 py-2">{travel.selectedDate}</td>
      <td className="border px-4 py-2">{travel.selectedTime}</td>
      <td className="border px-4 py-2 flex justify-center space-x-3">
        <button
          className="bg-blue-800 text-white p-2 rounded-md"
          onClick={() => handleEdit(travel)}
        >
          <FiEdit />
        </button>
        <button
          className="bg-blue-600 text-white p-2 rounded-md"
          onClick={() => handleDelete(travel._id)}
        >
          <MdDeleteOutline />
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default BasicRideHistory;
