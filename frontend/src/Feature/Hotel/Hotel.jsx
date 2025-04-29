import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Grid } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import 'swiper/css/autoplay';

import API from './services/api';
import welcomeImage from './images/intro1.png'; 
import Footer from '../../components/Footer';
import AIChatbot from './AIChatbot';

const Hotel = () => {
    const [hotels, setHotels] = useState([]);
    const [location, setLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const districts = [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
        "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
        "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
        "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
        "Polonnaruwa", "Puttalam", "Rathnapura", "Trincomalee", "Vavuniya"
    ];

    const fetchHotels = async () => {
        setIsLoading(true);
        try {
            const params = {};
            const effectiveQuery = searchQuery || location;
            if (effectiveQuery) {
                params.location = effectiveQuery;
            }
            const { data } = await API.get('/hotels', { params });
            setHotels(data || []);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            setHotels([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, [location, searchQuery]);

    return (
        <>
        <style global="true">{`
            .swiper-button-prev,
            .swiper-button-next {
              display: none !important;
            }
          `}</style>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-opensans relative mt-26">

            <section className="py-16 md:py-20 px-6 md:px-20 bg-gray-300 rounded-3xl md:mt-10 mx-0 md:mx-auto max-w-7xl relative overflow-hidden">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5 leading-tight font-poppins">
                           Experience the Ultimate in Comfort and Style
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-700 mb-8 font-opensans">
                           Discover unparalleled elegance and impeccable service at our handpicked hotels. Your dream stay awaits.
                        </p>
                         <a href="#hotel-listings"
                            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out font-opensans text-base"
                         >
                             Explore Hotels
                         </a>
                    </div>
                    <div className="flex justify-center md:justify-end mt-8 md:mt-0">
                      <img
                          src={welcomeImage}
                          alt="Luxury Hotel Room"
                          className="rounded-2xl shadow-xl w-full max-w-sm md:max-w-md lg:max-w-lg object-cover transform transition duration-300 hover:scale-105"
                      />
                    </div>
                </div>
            </section>

            <div className="max-w-5xl mx-auto mt-20 p-6 rounded-3xl shadow-xl bg-gradient-to-r from-indigo-700 via-purple-500 to-blue-300 backdrop-blur-md flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-full md:w-2/3">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black text-lg z-10 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search hotels by destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-black placeholder-gray-600 font-opensans focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 backdrop-blur-sm"
                    />
                </div>
                <select
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    className="w-full md:w-1/3 bg-white text-gray-600 py-3 px-4 rounded-full font-opensans focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300"
                >
                    <option value="">Select a Region</option>
                    {districts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                </select>
            </div>

            <div id="hotel-listings" className="container mx-auto mt-16 px-4 sm:px-6 lg:px-10 xl:px-16 relative mb-20">
                {isLoading ? (
                    <p className="text-center text-gray-600 text-lg py-10">Loading hotels...</p>
                ) : !hotels || hotels.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg py-10">No hotels found matching your criteria.</p>
                ) : (
                    <div className="relative">
                        <button
                            ref={prevRef}
                            aria-label="Previous slide"
                            className="absolute top-1/2 transform -translate-y-1/2 left-[-15px] sm:left-[-20px] lg:left-[-30px] xl:left-[-40px] z-20 bg-white text-gray-700 rounded-full shadow-lg p-2 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button
                            ref={nextRef}
                            aria-label="Next slide"
                            className="absolute top-1/2 transform -translate-y-1/2 right-[-15px] sm:right-[-20px] lg:right-[-30px] xl:right-[-40px] z-20 bg-white text-gray-700 rounded-full shadow-lg p-2 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <ChevronRight size={28} />
                        </button>
                        <Swiper
                            modules={[Navigation, Autoplay, Grid]}
                            navigation={true} 
                            onInit={(swiper) => {
                                setTimeout(() => {
                                    if (swiper.params && swiper.params.navigation && prevRef.current && nextRef.current) {
                                        swiper.params.navigation.prevEl = prevRef.current;
                                        swiper.params.navigation.nextEl = nextRef.current;
                                        swiper.navigation.init(); 
                                        swiper.navigation.update(); 
                                    }
                                }, 0);
                            }}
                            grid={{ rows: 2, fill: 'row' }}
                            spaceBetween={24} 
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: true,
                                pauseOnMouseEnter: true,
                            }}
                            breakpoints={{
                                320: { slidesPerView: 1, grid: { rows: 2 }, spaceBetween: 16 }, // Mobile
                                640: { slidesPerView: 2, grid: { rows: 2 }, spaceBetween: 20 }, // Tablet Portrait
                                1024: { slidesPerView: 3, grid: { rows: 2 }, spaceBetween: 24 }, // Tablet Landscape / Small Desktop
                                1280: { slidesPerView: 4, grid: { rows: 2 }, spaceBetween: 24 }, // Standard Desktop
                            }}
                            className="pb-6 pt-2" 
                        >
                            {hotels.map((hotel) => (
                                <SwiperSlide key={hotel._id} style={{ height: 'auto' }} className="self-stretch mb-6 p-1"> 
                                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg flex flex-col h-full transition-shadow duration-300 font-opensans group max-w-xs mx-auto">
                                        <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                                            <img
                                                src={hotel.coverPhoto || `https://via.placeholder.com/400x200.png?text=No+Image`}
                                                alt={hotel.name || 'Hotel Image'}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy" 
                                            />
                                        </div>
                                        {/* Content Container */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3
                                                className="text-base font-semibold text-gray-800 font-poppins mb-1 truncate"
                                                title={hotel.name || 'Hotel Name Unavailable'}
                                            >
                                                {hotel.name || 'Hotel Name Unavailable'}
                                            </h3>
                                            <div className="text-gray-600 text-xs flex items-center mt-1 mb-2" title={hotel.location || 'Location Unavailable'}>
                                                <FaMapMarkerAlt className="mr-1.5 text-gray-400 flex-shrink-0" size={12} />
                                                <span className="truncate">{hotel.location || 'N/A'}</span>
                                            </div>
                                            <p className="text-gray-700 font-semibold text-sm my-1">
                                                LKR {hotel.price != null ? hotel.price.toLocaleString() : 'N/A'} / night
                                            </p>
                                            <p className="text-gray-500 text-sm">⭐ {hotel.rating} / 5</p>
                                            <Link
                                                to={`/hotel/${hotel._id}`}
                                                className="mt-3 block bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white font-semibold py-2 px-4 rounded-md text-center transition duration-300 text-sm w-full" 
                                            >
                                                Explore Hotel
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>

            <div className="fixed bottom-5 right-5 z-50">
                <AIChatbot />
            </div>

            <Footer />
        </div>
        </>
        
    );
};

export default Hotel;




