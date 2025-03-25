import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  // State to store destinations
  const [destinations, setDestinations] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newDestination, setNewDestination] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const [location, setLocation] = useState({ lat: null, lng: null });

  // Handle input change
  const handleChange = (e) => {
    setNewDestination({ ...newDestination, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDestination({
        ...newDestination,
        image: URL.createObjectURL(file), // Preview the image
      });
    }
  };

  // Add or Update Destination
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedDestinations = [...destinations];
      updatedDestinations[editingIndex] = newDestination;
      setDestinations(updatedDestinations);
      setEditingIndex(null);
    } else {
      setDestinations([...destinations, newDestination]);
    }
    setNewDestination({ name: "", price: "", description: "", image: "" });
  };

  // Edit Destination
  const handleEdit = (index) => {
    setNewDestination(destinations[index]);
    setEditingIndex(index);
  };

  // Delete Destination
  const handleDelete = (index) => {
    const updatedDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(updatedDestinations);
  };

  // Get User GPS Location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Admin Dashboard 🛠️
      </h1>

      {/* Destination Form */}
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editingIndex !== null ? "Edit Destination" : "Add Destination"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={newDestination.name}
            onChange={handleChange}
            required
            placeholder="Destination Name"
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="number"
            name="price"
            value={newDestination.price}
            onChange={handleChange}
            required
            placeholder="Price per person per day"
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          />
          <textarea
            name="description"
            value={newDestination.description}
            onChange={handleChange}
            required
            placeholder="Enter destination description"
            rows="3"
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          ></textarea>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          />
          {newDestination.image && (
            <img
              src={newDestination.image}
              alt="Preview"
              className="w-full h-40 object-cover rounded-md mt-2"
            />
          )}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all"
          >
            {editingIndex !== null ? "Update Destination" : "Add Destination"} ✅
          </button>
        </form>
      </div>

      {/* Destinations List */}
      <div className="max-w-4xl mx-auto mt-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Destinations List 📍
        </h2>
        {destinations.length === 0 ? (
          <p className="text-center text-gray-600">No destinations added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {destinations.map((dest, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-xl font-semibold mt-2">{dest.name}</h3>
                <p className="text-gray-700">${dest.price} per person per day</p>
                <p className="text-gray-600 mt-1">{dest.description}</p>
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  >
                    Edit ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Remove ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GPS Tracking */}
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-gray-700">GPS Tracking 📍</h2>
        <button
          onClick={handleGetLocation}
          className="mt-3 px-5 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-all"
        >
          Get My Location 🌎
        </button>
        {location.lat && location.lng && (
          <p className="mt-3 text-gray-800">
            Latitude: {location.lat}, Longitude: {location.lng}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
