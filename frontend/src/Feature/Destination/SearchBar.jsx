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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search destinations..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;