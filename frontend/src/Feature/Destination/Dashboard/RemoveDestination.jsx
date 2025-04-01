import React, { useEffect, useState } from "react";

const RemoveDestination = () => {
  const [destinations, setDestinations] = useState([]);

  // Fetch all destinations
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

  // Delete Destination
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin-destinations/delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      alert(result.message);

      // Remove the deleted destination from state
      setDestinations(destinations.filter((dest) => dest._id !== id));
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Manage Destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div key={destination._id} className="bg-white shadow-lg rounded-lg p-4">
            <img
              src={`http://localhost:5000${destination.images[0]}`}
              alt={destination.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="text-xl font-semibold mt-3">{destination.name}</h3>
            <p className="text-gray-600">{destination.location}</p>
            <p className="text-gray-700 font-bold">${destination.price}</p>

            <button
              onClick={() => handleDelete(destination._id)}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded-md w-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};



  export default RemoveDestination;
  