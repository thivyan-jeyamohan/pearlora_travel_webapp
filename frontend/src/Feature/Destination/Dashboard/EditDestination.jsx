import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import backgroundImage from "../image/traveling-concept-with-landmarks.jpg"; // Import the image

const Edit = () => {
  const [destinations, setDestinations] = useState([]);
  const [destination, setDestination] = useState({
    name: "",
    location: "",
    price: "",
    discount: "",
    description: "",
    images: [],
  });
  const [errors, setErrors] = useState({}); // To hold validation error messages

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/admin-destinations/")
      .then((response) => response.json())
      .then((data) => setDestinations(data))
      .catch((error) => console.error("Error fetching destinations:", error));
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/admin-destinations/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedImages = data.images.map((image) => ({
            file: null,
            preview: `http://localhost:5000${image}`,
          }));
          setDestination({ ...data, images: formattedImages });
        })
        .catch((error) => console.error("Error fetching destination:", error));
    }
  }, [id]);

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
    const newImageFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setDestination((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageFiles],
    }));
  };

  const handleSubmit = (e) => {
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

    if (destination.images.length > 0) {
      destination.images.forEach((imageObj) => {
        if (imageObj.file) {
          formData.append("images", imageObj.file);
        } else {
          formData.append(
            "existingImages",
            imageObj.preview.replace("http://localhost:5000", "")
          );
        }
      });
    }

    fetch(`http://localhost:5000/api/admin-destinations/update/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        alert("Destination updated successfully!");
        navigate("/admin-dashboard");
      })
      .catch((error) => console.error("Error updating destination:", error));
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

  return (
    <div
      className="max-w-4xl mx-auto p-8 mt-6 bg-white shadow-xl rounded-lg"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {id ? (
        <>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            ✏️ Edit Destination
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium">Destination Name</label>
                <input
                  type="text"
                  name="name"
                  value={destination.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={destination.location}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={destination.price}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={destination.discount}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
                {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Description</label>
              <textarea
                name="description"
                value={destination.description}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Images</label>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {destination.images.map((imageObj, index) => (
                  <div key={index} className="relative w-28 h-28 border rounded-lg shadow-sm">
                    <img
                      src={imageObj.preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md hover:scale-105 transition-transform duration-200"
            >
              ✅ Update Destination
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🏝️ All Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.length > 0 ? (
              destinations.map((destination) => (
                <div key={destination._id} className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  <p className="text-gray-600">{destination.location}</p>
                  <p className="text-gray-600 font-semibold">${destination.price}</p>
                  <Link to={`/edit-destination/${destination._id}`}>
                    <button className="mt-3 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Edit ✏️
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No destinations found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Edit;
