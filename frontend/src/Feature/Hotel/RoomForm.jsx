import React, { useState, useEffect } from "react";
import API from "./services/api";

const RoomForm = ({ onClose, fetchRooms, roomData = null, hotels }) => {
  const [hotelId, setHotelId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [photo, setPhoto] = useState("");
  const [price, setPrice] = useState("");
  const [roomCategory, setRoomCategory] = useState("Single");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (roomData) {
      setHotelId(roomData.hotelId || "");
      setRoomNumber(roomData.roomNumber || "");
      setPhoto(roomData.photo || "");
      setPrice(roomData.price || "");
      setRoomCategory(roomData.roomCategory || "Single");
    } else {
      setHotelId("");
      setRoomNumber("");
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
      setPhoto(reader.result); // Base64 encoded image
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
      roomNumber,
      photo,
      price: parseFloat(price),
      roomCategory,
    };

    try {
      if (roomData?._id) {
        await API.put(`/rooms/${roomData._id}`, roomDataToSubmit);
      } else {
        await API.post("/rooms", roomDataToSubmit);
      }
      await fetchRooms();
      onClose();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl w-full max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        {roomData ? "Edit Room" : "Add New Room"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hotel Selection */}
        <div>
          <label htmlFor="hotelId" className="block text-sm font-medium text-gray-700">
            Hotel
          </label>
          <select
            id="hotelId"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

        {/* Room Number */}
        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
            Room Number
          </label>
          <input
            type="text"
            id="roomNumber"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
            Photo
          </label>
          <input
            type="file"
            id="photo"
            onChange={handleImageUpload}
            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Room Category */}
        <div>
          <label htmlFor="roomCategory" className="block text-sm font-medium text-gray-700">
            Room Category
          </label>
          <select
            id="roomCategory"
            value={roomCategory}
            onChange={(e) => setRoomCategory(e.target.value)}
            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
