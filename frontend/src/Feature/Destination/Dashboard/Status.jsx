import React, { useEffect, useState } from "react";

const AdminDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch destinations whenever the status filter changes
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const url = statusFilter
          ? `http://localhost:5000/api/admin-destinations?status=${statusFilter}`
          : `http://localhost:5000/api/admin-destinations`;

        console.log("Fetching with URL:", url); // Debugging log
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched destinations:", data); // Debugging log
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, [statusFilter]); // This hook triggers when `statusFilter` changes

  // Toggle status button logic
  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin-destinations/toggle-status/${id}`, {
        method: "PUT",
      });

      const result = await response.json();
      alert(result.message); // Show the status update result

      // After toggling, re-fetch the destinations (with or without filter)
      const updated = await fetch(statusFilter
        ? `http://localhost:5000/api/admin-destinations?status=${statusFilter}`
        : `http://localhost:5000/api/admin-destinations`);
      const data = await updated.json();
      setDestinations(data); // Update the state with fetched destinations
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Destinations</h2>

      {/* Filter by Status */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Destinations Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="6">
                  No destinations found.
                </td>
              </tr>
            ) : (
              destinations.map((destination) => (
                <tr key={destination._id} className="border-t">
                  <td className="p-4">{destination.name}</td>
                  <td className="p-4">{destination.location}</td>
                  <td className="p-4">{destination.category}</td>
                  <td className="p-4">${destination.price}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        destination.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {destination.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(destination._id)}
                      className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDestination;
