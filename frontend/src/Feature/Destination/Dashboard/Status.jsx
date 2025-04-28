import React, { useEffect, useState } from "react";

const AdminDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const url = statusFilter
          ? `http://localhost:5000/api/admin-destinations?status=${statusFilter}`
          : `http://localhost:5000/api/admin-destinations`;

        const response = await fetch(url);
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, [statusFilter]);

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin-destinations/toggle-status/${id}`, {
        method: "PUT",
      });

      const result = await response.json();
      alert(result.message);

      const updated = await fetch(statusFilter
        ? `http://localhost:5000/api/admin-destinations?status=${statusFilter}`
        : `http://localhost:5000/api/admin-destinations`);
      const data = await updated.json();
      setDestinations(data);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-indigo-600">Manage Destinations</h2>

        {/* Filter by Status */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="text-lg font-semibold text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Destinations Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-500 text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {destinations.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan="6">
                    No destinations found.
                  </td>
                </tr>
              ) : (
                destinations.map((destination) => (
                  <tr key={destination._id} className="hover:bg-gray-100 transition-colors">
                    <td className="p-4">{destination.name}</td>
                    <td className="p-4">{destination.location}</td>
                    <td className="p-4">{destination.category}</td>
                    <td className="p-4 font-semibold">${destination.price}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          destination.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {destination.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(destination._id)}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-md transition-all text-sm"
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
    </div>
  );
};

export default AdminDestination;
