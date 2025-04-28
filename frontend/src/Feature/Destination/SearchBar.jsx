import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ onResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      console.log("Making request with query:", query); // Debug log
      const response = await axios.get(`http://localhost:5000/api/admin-destinations/search?location=${query}`);
      if (typeof onResults === "function") {
        onResults(response.data);
      } else {
        console.error("onResults is not a function:", onResults);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error.response ? error.response.data : error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-lg max-w-3xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search destinations..."
        className="px-4 py-2 w-full md:w-2/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
