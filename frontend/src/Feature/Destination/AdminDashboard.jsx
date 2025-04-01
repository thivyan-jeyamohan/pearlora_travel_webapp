
import React, { useState } from "react";
import { FaPlus, FaBars, FaTimes } from "react-icons/fa";

const AdminDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [destination, setDestination] = useState({
    name: "",
    location: "",
    price: "",
    discount: "",
    images: [],
    description: "",
  });

  const handleChange = (e) => {
    setDestination({ ...destination, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDestination({ ...destination, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      {/* Sidebar */}
      <div className={`bg-blue-900 text-white w-64 p-4 ${showSidebar ? "block" : "hidden"} md:block`}>
        <button className="text-white mb-4 md:hidden" onClick={() => setShowSidebar(false)}>
          <FaTimes size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li className="cursor-pointer hover:text-gray-300"><FaPlus className="inline mr-2" /> Add Destination</li>
          
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <button className="mb-4 text-blue-600 md:hidden" onClick={() => setShowSidebar(true)}>
          <FaBars size={24} />
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Add New Destination</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Destination Name</label>
              <input type="text" name="name" value={destination.name} onChange={handleChange} required className="w-full p-3 border rounded-md" placeholder="Enter destination name" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Location</label>
              <input type="text" name="location" value={destination.location} onChange={handleChange} required className="w-full p-3 border rounded-md" placeholder="Enter location" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Price ($)</label>
              <input type="number" name="price" value={destination.price} onChange={handleChange} required className="w-full p-3 border rounded-md" placeholder="Enter price" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Discount (%)</label>
              <input type="number" name="discount" value={destination.discount} onChange={handleChange} className="w-full p-3 border rounded-md" placeholder="Enter discount (optional)" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Upload Images</label>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full p-3 border rounded-md" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Description</label>
              <textarea name="description" value={destination.description} onChange={handleChange} required className="w-full p-3 border rounded-md h-24" placeholder="Enter description"></textarea>
            </div>

            <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md">Add Destination</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
