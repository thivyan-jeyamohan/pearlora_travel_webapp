import React, { useState, useEffect } from "react";
import API from "./services/api";

const HotelForm = ({ onClose, fetchHotels, hotelData = null, onHotelSaved }) => {
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
                hotelDataToSubmit.hotelId = hotelId;
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
        <div className="p-6 bg-white shadow-lg rounded-2xl w-full max-w-lg mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                {hotelData ? "Edit Hotel" : "Add New Hotel"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Hotel ID */}
                <div>
                    <label htmlFor="hotelId" className="block text-sm font-medium text-gray-700">
                        Hotel ID
                    </label>
                    <input
                        type="text"
                        id="hotelId"
                        value={hotelId}
                        onChange={(e) => setHotelId(e.target.value)}
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={!!hotelData}
                    />
                </div>

                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
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

                {/* Availability */}
                <div>
                    <label htmlFor="availabilityStatus" className="block text-sm font-medium text-gray-700">
                        Availability
                    </label>
                    <select
                        id="availabilityStatus"
                        value={availabilityStatus}
                        onChange={(e) => setAvailabilityStatus(e.target.value)}
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                    </select>
                </div>

                {/* Rating */}
                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                        Rating
                    </label>
                    <input
                        type="number"
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="5"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
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
                    {coverPhoto && (
                        <img
                            src={coverPhoto}
                            alt="Cover"
                            className="mt-4 w-32 h-32 object-cover rounded-lg shadow-md"
                        />
                    )}
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

export default HotelForm;