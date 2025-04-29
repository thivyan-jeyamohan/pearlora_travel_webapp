import React, { useState, useEffect } from "react";
import API from "./services/api";

const RoomForm = ({ onClose, fetchRooms, roomData = null, hotels, onRoomSaved }) => {
  const [hotelId, setHotelId] = useState("");
  const [photo, setPhoto] = useState("");
  const [price, setPrice] = useState("");
  const [roomCategory, setRoomCategory] = useState("Single");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (roomData) {
      setHotelId(roomData.hotelId || "");
      setPhoto(roomData.photo || "");
      setPrice(roomData.price || "");
      setRoomCategory(roomData.roomCategory || "Single");
    } else {
      setHotelId("");
      setPhoto("");
      setPrice("");
      setRoomCategory("Single");
    }
  }, [roomData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      setUploading(false);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomDataToSubmit = {
      hotelId,
      photo,
      price: parseFloat(price),
      roomCategory,
    };

    try {
      if (roomData?._id) {
        await API.put(`/rooms/${roomData._id}`, roomDataToSubmit);
        window.alert("Room updated successfully!");
      } else {
        await API.post("/rooms", roomDataToSubmit);
        window.alert("The New Room Added successfully!");
      }
      await fetchRooms();
      if (onRoomSaved) {
        onRoomSaved();
      }
      onClose();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-400 to-blue-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
          {roomData ? "Edit Room" : "Add New Room"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Hotel Selection */}
          <div className="flex flex-col">
            <label htmlFor="hotelId" className="text-sm font-semibold text-gray-700 mb-1">
              Hotel
            </label>
            <select
              id="hotelId"
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a Hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload */}
          <div className="flex flex-col">
            <label htmlFor="photo" className="text-sm font-semibold text-gray-700 mb-1">
              Photo
            </label>
            <input
              type="file"
              id="photo"
              onChange={handleImageUpload}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
            {photo && (
              <img
                src={photo}
                alt="Room"
                className="mt-4 w-32 h-32 object-cover rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              min="1"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Room Category */}
          <div className="flex flex-col">
            <label htmlFor="roomCategory" className="text-sm font-semibold text-gray-700 mb-1">
              Room Category
            </label>
            <select
              id="roomCategory"
              value={roomCategory}
              onChange={(e) => setRoomCategory(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-2 px-4 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
