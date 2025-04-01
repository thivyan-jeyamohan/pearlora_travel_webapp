import React, { useState } from "react";
import SearchBar from "./SearchBar.jsx";

const MyComponent = () => {
  const [results, setResults] = useState([]);

  const handleSearchResults = (data) => {
    console.log("Search results:", data);
    setResults(data); // Store results in state
  };

  return (
    <div>
      <h1>Search Destinations</h1>
      <SearchBar onResults={handleSearchResults} />
      <ul>
        {results.map((destination) => (
          <li key={destination._id}>
            {destination.name} - {destination.location} (${destination.price})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;