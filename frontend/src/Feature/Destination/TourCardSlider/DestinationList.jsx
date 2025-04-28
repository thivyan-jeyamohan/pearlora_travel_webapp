import React, { useState } from "react";
import axios from "axios";

const DestinationList = () => {
  const [destination, setDestination] = useState({
    name: "",
    price: "",
    description: "",
    image: null,  // Store image file instead of URL
    preview: "",  // Store image preview URL
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0]; // Get the uploaded file
      if (file) {
        setDestination({
          ...destination,
          image: file,
          preview: URL.createObjectURL(file), // Create a preview URL
        });
      }
    } else {
      setDestination({ ...destination, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append("name", destination.name);
      formData.append("price", destination.price);
      formData.append("description", destination.description);
      formData.append("image", destination.image); // Attach the image file
  
      const response = await axios.post("http://localhost:5000/api/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert(response.data.message);
    } catch (error) {
      alert("Error saving destination");
      console.error(error);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Add a New Destination 🌍
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Destination Name */}
          <div>
            <label className="block text-gray-700 font-medium">Destination Name</label>
            <input
              type="text"
              name="name"
              value={destination.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter destination name"
            />
          </div>

          {/* Price Per Person */}
          <div>
            <label className="block text-gray-700 font-medium">Price Per Person (per day) ($)</label>
            <input
              type="number"
              name="price"
              value={destination.price}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter price"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">About Destination</label>
            <textarea
              name="description"
              value={destination.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter destination description"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Preview Image */}
          {destination.preview && (
            <div className="flex justify-center">
              <img
                src={destination.preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md shadow-md"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all"
          >
            Add Destination ✅
          </button>
        </form>
      </div>
    </div>
  );
};

export default DestinationList;
