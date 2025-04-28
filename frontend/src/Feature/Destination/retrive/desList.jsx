import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DesList = ({ selectedCategory }) => {
  const [destinations, setDestinations] = useState([]);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const url = selectedCategory
          ? `http://localhost:5000/api/admin-destinations?category=${selectedCategory}`
          : `http://localhost:5000/api/admin-destinations`;

        const response = await axios.get(url);
        setDestinations(response.data);

        response.data.forEach(async (destination) => {
          const weatherResponse = await axios.get(
            `http://localhost:5000/api/destination/${destination._id}`
          );
          setWeatherData((prevData) => ({
            ...prevData,
            [destination._id]: weatherResponse.data.weather,
          }));
        });
      } catch (error) {
        console.error("❌ Error fetching destinations or weather:", error);
      }
    };

    fetchDestinations();
  }, [selectedCategory]); // Fetch destinations based on selected category

  return (
    <div className="w-full text-center p-10">
      <h2 className="text-4xl font-bold mb-4">Explore Our Destinations</h2>
      <p className="text-gray-600 mb-8">Browse through our top destinations and start your journey!</p>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          1024: { slidesPerView: 3 },
        }}
      >
        {destinations.length === 0 ? (
          <p className="text-center text-gray-500">No destinations found.</p>
        ) : (
          destinations.map((destination) => {
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
                    {/* Destination name */}
                    <Link to={`/destination/${destination._id}`}>
                      <h3 className="text-lg font-bold text-center">{destination.name}</h3>
                    </Link>

                    {/* Weather */}
                    {weatherData[destination._id] && (
                      <div className="text-sm text-gray-500 text-center">
                        🌤️ {weatherData[destination._id].weather[0].description}, {weatherData[destination._id].main.temp}°C
                      </div>
                    )}

                    {/* Category and Tags */}
                    <div className="mt-3 flex justify-between items-start text-sm text-gray-700">
                      {/* Category */}
                      {destination.category && (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-500">Category:</span>
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs">
                            {destination.category}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {destination.tags && destination.tags.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-500">Tags:</span>
                          <div className="flex flex-wrap gap-2">
                            {destination.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Location & Price */}
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

export default DesList;
