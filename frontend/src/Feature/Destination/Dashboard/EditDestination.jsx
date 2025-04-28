import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import backgroundImage from "../image/traveling-concept-with-landmarks.jpg";

const Edit = () => {
  const [destinations, setDestinations] = useState([]);
  const [destination, setDestination] = useState({
    name: "",
    location: "",
    price: "",
    discount: "",
    description: "",
    category: "",
    tags: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

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
    setDestination({ ...destination, [name]: value });

    if (name === "name") {
      const nameRegex = /^[A-Za-z\s]*$/;
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

  const handleDeleteImage = (index) => {
    const imageToDelete = destination.images[index];

    // If it's an uploaded file (not a preview image)
    if (imageToDelete.file) {
      setDestination((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index), // Remove the image from the state
      }));
    } else {
      // For existing images (those that came from the backend)
      const remainingImages = destination.images.filter((_, i) => i !== index);
      setDestination((prev) => ({
        ...prev,
        images: remainingImages,
      }));

      // Now delete the image from the server
      fetch("http://localhost:5000/api/admin-destinations/delete-image", {
        method: "POST",
        body: JSON.stringify({
          image: imageToDelete.preview.replace("http://localhost:5000", ""), // Send only the path part
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Image deleted from server:", data);
        })
        .catch((error) => {
          console.error("Error deleting image from server:", error);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", destination.name);
    formData.append("location", destination.location);
    formData.append("price", destination.price);
    formData.append("discount", destination.discount);
    formData.append("description", destination.description);
    formData.append("category", destination.category);
    formData.append("tags", destination.tags);

    destination.images.forEach((imageObj) => {
      if (imageObj.file) {
        formData.append("images", imageObj.file);
      } else {
        formData.append("existingImages", imageObj.preview.replace("http://localhost:5000", ""));
      }
    });

    fetch(`http://localhost:5000/api/admin-destinations/update/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        alert("Destination updated successfully!");
        navigate("/dashboard");
        fetchDestinations();
      })
      .catch((error) => console.error("Error updating destination:", error));
  };

  const fetchDestinations = () => {
    fetch("http://localhost:5000/api/admin-destinations/")
      .then((response) => response.json())
      .then((data) => setDestinations(data))
      .catch((error) => console.error("Error fetching destinations:", error));
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

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8">
        {id ? (
          <>
            <div className="text-center mt-5.5">
              <h2 className="text-4xl font-extrabold text-green-700 mb-8">✏️ Edit Destination</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-1">Destination Name</label>
                  <input
                    type="text"
                    name="name"
                    value={destination.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-400"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div>
                  <label className="block font-bold mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={destination.location}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-400"
                  />
                  {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block font-bold mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={destination.price}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-400"
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                <div>
                  <label className="block font-bold mb-1">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={destination.discount}
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-400"
                  />
                  {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  name="description"
                  value={destination.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-400"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  name="category"
                  value={destination.category}
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-400"
                >
                  <option value="">Select Category</option>
                  <option value="beach">Beach</option>
                  <option value="mountain">Mountain</option>
                  <option value="city">City</option>
                  <option value="cultural">Cultural</option>
                  <option value="adventure">Adventure</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>

              {/* Tags */}
              <div>
                <label className="block font-bold mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={destination.tags}
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-400"
                />
                {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
              </div>

              <div>
                <label className="block font-bold mb-1">Images</label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {destination.images.map((imageObj, index) => (
                    <div key={index} className="relative w-28 h-28 border rounded-md overflow-hidden shadow-md">
                      <img
                        src={imageObj.preview}
                        alt={`Preview ${index}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-bl-md hover:bg-red-700"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border p-3 rounded-md"
                />
                {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-md hover:scale-105 transition-transform duration-200"
                >
                  ✅ Update Destination
                </button>
                <Link to="/dashboard" className="flex-1">
                  <button
                    type="button"
                    className="w-full bg-gray-400 hover:bg-gray-600 text-white py-3 rounded-md"
                  >
                    ⬅ Back to Dashboard
                  </button>
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">🏝️ All Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {destinations.length > 0 ? (
                destinations.map((destination) => (
                  <div key={destination._id} className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <p className="text-gray-600">{destination.location}</p>
                    <p className="text-green-700 font-bold">${destination.price}</p>
                    <Link to={`/edit-destination/${destination._id}`}>
                      <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700">
                        ✏️ Edit
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <p>No destinations available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit;
