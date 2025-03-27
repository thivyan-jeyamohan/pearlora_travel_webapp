import React, { useState, useEffect } from 'react';
import API from './services/api';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import introImage from './images/intro.png';
import welcomeImage from './images/welcome.jpeg';

const Hotel = () => {
    const [hotels, setHotels] = useState([]);
    const [location, setLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const districts = [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
        "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
        "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
        "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
        "Polonnaruwa", "Puttalam", "Rathnapura", "Trincomalee", "Vavuniya"
    ];

    const fetchHotels = async () => {
        try {
            const { data } = await API.get(`/hotels`, { params: { location: searchQuery || location } });
            setHotels(data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, [location, searchQuery]);

    return (
        <div className="bg-gray-50 min-h-screen">

           
            <div className="relative h-96 md:h-[60vh] overflow-hidden">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop
                    className="h-full"
                >
                    <SwiperSlide>
                        <img src={introImage} alt="Hotel Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-30"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <h2 className="text-white text-3xl font-bold">SEARCH FOR A HOTEL</h2>
                            <p className="text-white text-lg mt-1">Get the best deals & exclusive offers</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={introImage} alt="Hotel Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-30"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <h2 className="text-white text-3xl font-bold">SEARCH FOR A HOTEL1</h2>
                            <p className="text-white text-lg mt-1">Get the best deals & exclusive offers</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={introImage} alt="Hotel Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-30"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <h2 className="text-white text-3xl font-bold">SEARCH FOR A HOTEL2</h2>
                        <p className="text-white text-lg mt-1">Get the best deals & exclusive offers</p>
                    </div>
                    </SwiperSlide>
                </Swiper>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                    <h2 className="text-4xl font-bold mb-2">Discover Your Perfect Getaway</h2>
                    <p className="text-lg">Find the best hotels and exclusive offers for your dream vacation.</p>
                </div>
            </div>

            <section className="py-16 px-6 md:px-20 bg-gray-50">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    {/* Text Content */}
    <div className="text-center md:text-left">
      <h2 className="text-4xl font-extrabold text-gray-800 leading-tight mb-4">
        Welcome to Your Dream Stay!
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Discover a world of comfort and elegance at our curated selection of hotels. 
        Whether you're planning a romantic getaway or a family vacation, 
        we offer personalized experiences that suit your every need.
      </p>
      <a
        href="#"
        className="inline-block px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        Learn More
      </a>
    </div>

    {/* Image */}
    <div className="flex justify-center md:justify-end">
      <img
        src={welcomeImage} // Replace with your imported image
        alt="Luxury Hotel"
        className="rounded-2xl shadow-lg w-full max-w-md object-cover"
      />
    </div>
  </div>
</section>


            {/* Search and Filter Section */}
            <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Find Your Ideal Hotel</h2>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter a destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                        className="border border-gray-300 p-3 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select a Region</option>
                        {districts.map((district) => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Hotels Listing Section */}
            <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                {hotels.length > 0 ? (
                    hotels.map((hotel) => (
                        <div key={hotel._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform flex flex-col h-full">
                            <img src={hotel.coverPhoto} alt={hotel.name} className="w-full h-48 object-cover" />
                            <div className="p-4 flex flex-col justify-between flex-grow">
                                <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
                                <div className="text-gray-600 flex items-center mb-2">
                                    <FaMapMarkerAlt className="mr-1 text-red-700" /> {hotel.location}
                                </div>
                                <p className="text-blue-600 font-semibold mt-1">${hotel.price} per night</p>
                                <p className="text-yellow-500 mt-1">⭐ {hotel.rating} / 5</p>
                                <Link
                                    to={`/hotel/${hotel._id}`}
                                    className="mt-4 block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-center"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600 col-span-full">No hotels found.</p>
                )}
            </div>
        </div>
    );
};

export default Hotel;
