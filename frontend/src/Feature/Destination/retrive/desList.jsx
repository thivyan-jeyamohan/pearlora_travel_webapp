import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DesList = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin-destinations");
        setDestinations(response.data);
      } catch (error) {
        console.error("❌ Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

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
          1024: { slidesPerView: 3 }
        }}
      >
        {destinations.length === 0 ? (
          <p className="text-center text-gray-500">No destinations found.</p>
        ) : (
          destinations.map((destination) => {
            // Calculate discounted price if discount exists
            const discountedPrice =
              destination.discount > 0
                ? destination.price - (destination.price * destination.discount) / 100
                : destination.price;

            return (
              <SwiperSlide key={destination._id} className="cursor-pointer">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                  {/* Destination Image */}
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

                  {/* Destination Info */}
                  <div className="p-4">
                    <Link to={`/destination/${destination._id}`}>
                      <h3 className="text-lg font-bold">{destination.name}</h3>
                    </Link>
                    <p className="text-gray-600">{destination.location}</p>

                    <div className="mt-6 flex justify-between items-center text-gray-700 text-sm">
                      <span>📍 {destination.location}</span>
                    </div>

                    <div className="mt-3 text-right">
                      <span className="text-gray-400 line-through">
                        ${destination.price}
                      </span>
                      <span className="text-red-500 text-xl font-bold ml-2">
                        ${discountedPrice.toFixed(2)}
                      </span>
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
