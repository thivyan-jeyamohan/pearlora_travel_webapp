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
    <div className="p-4 bg-white border shadow-md rounded-lg">
      <h3 className="text-xl mb-4 font-semibold">
        {hotelData ? "Edit Hotel" : "Add New Hotel"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Hotel ID</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            required
            disabled={!!hotelData}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Hotel Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Location</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Availability</label>
          <select
            className="w-full p-2 border rounded-md"
            value={availabilityStatus}
            onChange={(e) => setAvailabilityStatus(e.target.value)}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Rating</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Cover Photo</label>
          <input
            type="file"
            className="w-full p-2 border rounded-md"
            onChange={handleImageUpload}
          />
          {imageError && <p className="text-red-500">{imageError}</p>} 
          {uploading && <p className="text-blue-500">Uploading...</p>}
          {coverPhoto && (
            <div className="mt-2">
              <img
                src={coverPhoto}
                alt="Cover"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="p-2 bg-green-500 text-white rounded-lg"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-gray-500 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
