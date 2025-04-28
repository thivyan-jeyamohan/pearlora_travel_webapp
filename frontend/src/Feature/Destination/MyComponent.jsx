import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MyComponent = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [category, setCategory] = useState("All");
  const [allDestinations, setAllDestinations] = useState([]);

  useEffect(() => {
    const fetchAllDestinations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin-destinations");
        setAllDestinations(response.data);
        setResults(response.data.filter(destination => destination.status === "Published"));
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchAllDestinations();
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const newTimer = setTimeout(() => {
      filterResults(e.target.value, category);
    }, 500);
    setDebounceTimer(newTimer);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    filterResults(query, selectedCategory);
  };

  const filterResults = (searchText, selectedCategory) => {
    let filtered = allDestinations;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (dest) => dest.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchText.trim() !== "") {
      filtered = filtered.filter((dest) =>
        dest.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    filtered = filtered.filter((dest) => dest.status === "Published");

    setResults(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-16">
        <div className="w-full sm:w-2/3 relative">
          <input
            type="text"
            placeholder="🔍 Search for a destination..."
            value={query}
            onChange={handleInputChange}
            className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </div>
        </div>

        <div className="w-full sm:w-1/3">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-4 border border-gray-300 rounded-full shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option value="All">🌍 All Categories</option>
            <option value="Beach">🏖️ Beach</option>
            <option value="Mountain">⛰️ Mountain</option>
            <option value="City">🏙️ City Break</option>
            <option value="Adventure">🧗 Adventure</option>
          </select>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Explore Our Destinations</h2>
        <p className="text-gray-600">Browse through our top destinations and start your journey!</p>
      </div>

      {/* Swiper Display */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          1024: { slidesPerView: 3 },
        }}
      >
        {results.length === 0 ? (
          <p className="text-center text-gray-500">No destinations found.</p>
        ) : (
          results.map((destination) => {
            const discountedPrice =
              destination.discount > 0
                ? destination.price - (destination.price * destination.discount) / 100
                : destination.price;

            return (
              <SwiperSlide key={destination._id} className="cursor-pointer">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={`http://localhost:5000${destination.images[0]}`}
                      alt={destination.name}
                      className="w-full h-64 object-cover"
                    />
                    {destination.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full">
                        {destination.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4 text-left">
                    <Link to={`/destination/${destination._id}`}>
                      <h3 className="text-lg font-bold text-center">{destination.name}</h3>
                    </Link>

                    <div className="mt-3 flex justify-between items-start text-sm text-gray-700 flex-wrap">
                      {destination.category && (
                        <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                          {destination.category}
                        </span>
                      )}
                      {destination.tags &&
                        destination.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-600 text-xs font-medium px-3 py-1 rounded-full ml-2"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-between items-center text-sm text-gray-700">
                      <span>📍 {destination.location}</span>
                      <div className="text-right">
                        <span className="text-gray-400 line-through mr-2">
                          ${destination.price}
                        </span>
                        <span className="text-red-500 text-xl font-bold">
                          ${discountedPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })
        )}
      </Swiper>
    </div>
  );
};

export default MyComponent;
