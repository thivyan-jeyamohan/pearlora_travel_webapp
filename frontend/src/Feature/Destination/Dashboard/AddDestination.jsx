import React, { useState } from "react";
import { FaBars } from "react-icons/fa";

const AddDestination = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [destination, setDestination] = useState({
    name: "",
    location: "",
    price: "",
    discount: 0,
    images: [],
    description: "",
    category: "",
    tags: "",
    status: "Draft",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestination({ ...destination, [name]: value });

    if (name === "name") {
      const nameRegex = /^[A-Za-z\s]*$/;
      if (value && !nameRegex.test(value)) {
        setErrors({ ...errors, name: "Destination name must contain only letters and spaces." });
      } else {
        setErrors({ ...errors, name: "" });
      }
    }

    if (name === "discount") {
      const discount = parseFloat(value);
      if (discount >= 0 && discount <= 100) {
        setDestination({
          ...destination,
          discount: discount,
          price: destination.price ? destination.price - (destination.price * discount / 100) : destination.price,
        });
      } else {
        setErrors({ ...errors, discount: "Discount must be between 0 and 100." });
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

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", destination.name);
    formData.append("location", destination.location);
    formData.append("price", destination.price);
    formData.append("discount", destination.discount);
    formData.append("description", destination.description);
    formData.append("category", destination.category);
    formData.append("tags", destination.tags);
    formData.append("status", destination.status);

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
      setDestination({ name: "", location: "", price: "", discount: 0, images: [], description: "", category: "", tags: "", status: "Draft" });
    } catch (error) {
      console.error("Error submitting destination:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="flex-1">
        <button className="text-blue-600 md:hidden mb-6" onClick={() => setShowSidebar(true)}>
          <FaBars size={24} />
        </button>

        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Add New Destination</h2>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Destination Name */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Destination Name</label>
              <input
                type="text"
                name="name"
                value={destination.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter destination name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={destination.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter location"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Price ($)</label>
              <input
                type="number"
                name="price"
                value={destination.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter price"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Discount */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={destination.discount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter discount"
              />
              {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Category</label>
              <select
                name="category"
                value={destination.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select category</option>
                <option value="Beach">Beach</option>
                <option value="Mountain">Mountain</option>
                <option value="City Break">City Break</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={destination.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. family, romantic, trekking"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Status</label>
              <select
                name="status"
                value={destination.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            {/* Images */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={destination.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter description"
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition transform duration-300"
            >
              Add Destination
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDestination;
