import React, { useState } from "react";
import { FaBars } from "react-icons/fa";

const AddDestination = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [destination, setDestination] = useState({
    name: "",
    location: "",
    price: "",
    discount: "",
    images: [],
    description: "",
  });
  const [errors, setErrors] = useState({}); // To hold validation error messages

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update destination state
    setDestination({ ...destination, [name]: value });

    // Real-time validation for destination name
    if (name === "name") {
      const nameRegex = /^[A-Za-z\s]*$/;  // Only allow letters and spaces
      if (value && !nameRegex.test(value)) {
        setErrors({ ...errors, name: "Destination name must contain only letters and spaces." });
      } else {
        setErrors({ ...errors, name: "" });
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDestination({ ...destination, images: files });
  };

  const validate = () => {
    const errors = {};

    if (!destination.name) errors.name = "Destination name is required.";
    if (!destination.location) errors.location = "Location is required.";
    if (!destination.price) errors.price = "Price is required.";
    if (destination.price <= 0) errors.price = "Price must be greater than 0.";
    if (!destination.description) errors.description = "Description is required.";
    
    if (destination.discount && (destination.discount < 0 || destination.discount > 100)) {
      errors.discount = "Discount must be between 0 and 100.";
    }

    if (destination.images.length === 0) {
      errors.images = "At least one image is required.";
    }

    setErrors(errors); // Set errors in the state
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validate()) {
      return; // If validation fails, stop form submission
    }

    const formData = new FormData();
    formData.append("name", destination.name);
    formData.append("location", destination.location);
    formData.append("price", destination.price);
    formData.append("discount", destination.discount);
    formData.append("description", destination.description);

    destination.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch("http://localhost:5000/api/admin-destinations/add", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert(result.message);
      setDestination({ name: "", location: "", price: "", discount: "", images: [], description: "" });
    } catch (error) {
      console.error("Error submitting destination:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <button className="mb-4 text-blue-600 md:hidden" onClick={() => setShowSidebar(true)}>
          <FaBars size={24} />
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Add New Destination</h2>
          <form onSubmit={handleSubmit}>
            {/* Destination Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Destination Name</label>
              <input
                type="text"
                name="name"
                value={destination.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
                placeholder="Enter destination name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Location</label>
              <input
                type="text"
                name="location"
                value={destination.location}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
                placeholder="Enter location"
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Price ($)</label>
              <input
                type="number"
                name="price"
                value={destination.price}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
                placeholder="Enter price"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            {/* Discount */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={destination.discount}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                placeholder="Enter discount (optional)"
              />
              {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-md"
              />
              {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Description</label>
              <textarea
                name="description"
                value={destination.description}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md h-24"
                placeholder="Enter description"
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md">
              Add Destination
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDestination;
