import React, { useState, useEffect } from "react";
import API from "./services/api";

const HotelForm = ({ onClose, fetchHotels, hotelData = null, onHotelSaved }) => {
    // const [hotelId, setHotelId] = useState("");
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
            // setHotelId(hotelData.hotelId || "");
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
            // setHotelId("");
            setName("");
            setLocation("");
            setPrice("");
            setAvailabilityStatus("Available");
            setRating("");
            setDescription("");
            setCoverPhoto("");
        }
    }, [hotelData]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverPhoto(reader.result); // Base64 encoded image
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
                window.alert("Hotel updated successfully!");
            } else {
                await API.post("/hotels", hotelDataToSubmit);
                window.alert("The New Hotel Added successfully!");
            }
            await fetchHotels();
            if (onHotelSaved) {
                onHotelSaved();
            }
            onClose();
        } catch (error) {
            console.error("Error saving hotel:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-purple-400 to-blue-300 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                {hotelData ? "Edit Hotel" : "Add New Hotel"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Hotel Name</label>
                    <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. The Royal Inn"
                    required
                    />
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                    <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Colombo , Vavuniya"
                    required
                    />
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">Price per Night (₹)</label>
                    <input
                    type="number"
                    id="price"
                    value={price}
                    min="1"
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    />
                </div>

                {/* Availability */}
                <div>
                    <label htmlFor="availabilityStatus" className="block text-sm font-semibold text-gray-700 mb-1">Availability</label>
                    <select
                    id="availabilityStatus"
                    value={availabilityStatus}
                    onChange={(e) => setAvailabilityStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    </select>
                </div>

                {/* Rating */}
                <div>
                    <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-1">Rating (1 to 5)</label>
                    <input
                    type="number"
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    min="1"
                    max="5"
                    step="0.1"
                    required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows="3"
                    placeholder="Write a short description about the hotel..."
                    required
                    />
                </div>

                {/* Photo Upload */}
                <div>
                    <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-1">Hotel Cover Photo</label>
                    <input
                    type="file"
                    id="photo"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
                    {coverPhoto && (
                    <img
                        src={coverPhoto}
                        alt="Cover"
                        className="mt-4 w-36 h-36 object-cover rounded-lg shadow-md"
                    />
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                    <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                    Save Hotel
                    </button>
                </div>
                </form>
            </div>
        </div>

    );
};

export default HotelForm;