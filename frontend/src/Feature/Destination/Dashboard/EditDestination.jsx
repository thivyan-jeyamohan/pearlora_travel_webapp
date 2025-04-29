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
    if (imageToDelete.file) {
      setDestination((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      const remainingImages = destination.images.filter((_, i) => i !== index);
      setDestination((prev) => ({
        ...prev,
        images: remainingImages,
      }));

      fetch("http://localhost:5000/api/admin-destinations/delete-image", {
        method: "POST",
        body: JSON.stringify({
          image: imageToDelete.preview.replace("http://localhost:5000", ""),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json())
        .then((data) => console.log("Image deleted:", data))
        .catch((error) => console.error("Delete error:", error));
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
      .catch((error) => console.error("Update error:", error));
  };

  const fetchDestinations = () => {
    fetch("http://localhost:5000/api/admin-destinations/")
      .then((response) => response.json())
      .then((data) => setDestinations(data))
      .catch((error) => console.error("Fetch error:", error));
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
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10">
        {id ? (
          <>
            <h2 className="text-5xl font-bold text-center text-green-700 mb-10 animate-fade-in">
              ✏️ Edit Destination
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* FORM FIELDS */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block font-semibold mb-2">Destination Name</label>
                  <input
                    type="text"
                    name="name"
                    value={destination.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={destination.location}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                  />
                  {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>
              </div>

              {/* Price, Discount */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={destination.price}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-2">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={destination.discount}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                  />
                  {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={destination.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              {/* Category and Tags */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2">Category</label>
                  <select
                    name="category"
                    value={destination.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                  >
                    <option value="">Select Category</option>
                    <option value="beach">Beach</option>
                    <option value="mountain">Mountain</option>
                    <option value="city">City</option>
                    <option value="cultural">Cultural</option>
                    <option value="adventure">Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={destination.tags}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block font-semibold mb-2">Images</label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {destination.images.map((imageObj, index) => (
                    <div key={index} className="relative w-28 h-28 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform">
                      <img src={imageObj.preview} alt="" className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-800"
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
                  className="w-full border p-3 rounded-lg shadow-sm"
                />
              </div>

              {/* Submit and Back */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 hover:scale-105 text-white py-3 rounded-lg transition-all duration-200"
                >
                  ✅ Update Destination
                </button>
                <Link to="/dashboard" className="flex-1">
                  <button
                    type="button"
                    className="w-full bg-gray-500 hover:bg-gray-700 hover:scale-105 text-white py-3 rounded-lg transition-all duration-200"
                  >
                    ⬅ Back
                  </button>
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-10 animate-fade-in">🏝️ All Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination) => (
                <div key={destination._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  <p className="text-gray-600">{destination.location}</p>
                  <p className="text-green-600 font-semibold">${destination.price}</p>
                  <Link to={`/edit-destination/${destination._id}`}>
                    <button className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg">
                      ✏️ Edit
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit;
