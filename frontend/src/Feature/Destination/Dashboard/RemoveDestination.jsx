import React, { useEffect, useState } from "react";

const RemoveDestination = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin-destinations/");
      const data = await response.json();
      setDestinations(data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin-destinations/delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      alert(result.message);

      setDestinations(destinations.filter((dest) => dest._id !== id));
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-green-700 mb-10">
          🗺️ Manage Your Destinations
        </h2>

        {destinations.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No destinations available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div
                key={destination._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
              >
                <img
                  src={`http://localhost:5000${destination.images[0]}`}
                  alt={destination.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800">{destination.name}</h3>
                  <p className="text-gray-600 mt-2">{destination.location}</p>
                  <p className="text-green-600 font-bold text-lg mt-2">${destination.price}</p>

                  <button
                    onClick={() => handleDelete(destination._id)}
                    className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition duration-300"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveDestination;
