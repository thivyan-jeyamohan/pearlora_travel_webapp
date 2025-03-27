import React, { useState, useEffect } from "react";
import API from "./services/api";

const HotelForm = ({ onClose, fetchHotels, hotelData = null }) => {
  const [hotelId, setHotelId] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("Available");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    if (hotelData) {
      setHotelId(hotelData.hotelId || "");
      setName(hotelData.name || "");
      setLocation(hotelData.location || "");
      setPrice(hotelData.price || "");
      setAvailabilityStatus(
        hotelData.availabilityStatus ? "Available" : "Unavailable"
      );
      setRating(hotelData.rating || "");
      setDescription(hotelData.description || "");
      setCoverPhoto(hotelData.coverPhoto || "");
    } else {
      setHotelId("");
      setName("");
      setLocation("");
      setPrice("");
      setAvailabilityStatus("Available");
      setRating("");
      setDescription("");
      setCoverPhoto("");
    }
  }, [hotelData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setCoverPhoto("");
      setImageError("Please select an image.");
      return;
    }

    if (file.size > 2000000) { // 2MB limit
      setImageError("Image size must be less than 2MB.");
      return;
    }

    setImageError(null);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      setCoverPhoto(reader.result);
      setUploading(false);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setImageError("Error reading the image file.");
      setUploading(false);
      setCoverPhoto("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !location || !price || !rating || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!coverPhoto) {
      alert("Please upload image first!");
      return;
    }

    if (imageError) {
      alert(`Image error: ${imageError}`);
      return;
    }

    const hotelDataToSubmit = {
      name,
      location,
      price: parseFloat(price),
      availabilityStatus: availabilityStatus === "Available",
      rating: parseFloat(rating),
      description,
      coverPhoto,
    };

    try {
      if (hotelData?._id) {
        await API.put(`/hotels/${hotelData._id}`, hotelDataToSubmit);
      } else {
        hotelDataToSubmit.hotelId = hotelId;
        await API.post("/hotels", hotelDataToSubmit);
      }
      fetchHotels();
      onClose();
    } catch (error) {
      console.error("Error saving hotel:", error);
      alert("Error saving hotel. Check the console for more details.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        {hotelData ? "Edit Hotel" : "Add New Hotel"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Hotel ID</label>
            <input
              type="text"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
              required
              disabled={!!hotelData}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Hotel Name</label>
            <input
              type="text"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Availability</label>
            <select
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <input
              type="number"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Cover Photo</label>
            <input
              type="file"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleImageUpload}
            />
            {imageError && <p className="text-sm text-red-500 mt-2">{imageError}</p>}
            {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
            {coverPhoto && (
              <div className="mt-4">
                <img
                  src={coverPhoto}
                  alt="Cover"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
