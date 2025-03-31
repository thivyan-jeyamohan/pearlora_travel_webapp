import React, { useState, useEffect } from 'react';
import API from './services/api';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import introImage from './images/intro.png';
import welcomeImage from './images/intro1.png'; 

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
        <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen font-['Inter']">
            {/* Hero Section with Carousel */}
            <div className="relative h-96 overflow-hidden">  
                <img src={introImage} alt="Hotel Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                    <h2 className="text-4xl font-bold">Find Your Perfect Getaway</h2>
                    <p className="text-lg">Explore the best hotels and exclusive deals.</p>
                </div>   
            </div>

            {/* Welcome Section */}
            <section className="py-20 px-6 md:px-20 bg-white shadow-lg rounded-3xl mt-8 relative overflow-hidden">
                
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-30 transform skew-y-[-5deg] origin-top-left"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Experience the Ultimate in Comfort and Style
                        </h2>
                        <p className="text-xl text-gray-700 mb-8">
                            Discover unparalleled elegance and impeccable service at our handpicked hotels.  Your dream stay awaits.
                        </p>
                        <Link to="/hotel" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300 ease-in-out">
                            Explore Hotels
                        </Link>
                    </div>
                    <img src={welcomeImage} alt="Luxury Hotel Room" className="rounded-3xl shadow-2xl w-full max-w-2xl hover:scale-105 transition duration-300" />
                </div>
            </section>

            {/* Search and Filter Section - Modernized */}
            <div className="max-w-5xl mx-auto mt-17 p-6 bg-white rounded-3xl shadow-md flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-2/3">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search hotels by destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-200 transition duration-300"
                    />
                </div>
                <select
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    className="w-full md:w-1/3 border border-gray-300 py-3 px-4 rounded-full focus:ring-2 focus:ring-blue-200 transition duration-300"
                >
                    <option value="">Select a Region</option>
                    {districts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                </select>
            </div>

            {/* Hotel Listing */}
            <div className="max-w-6xl mx-auto mt-17 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hotels.length > 0 ? (
                    hotels.map((hotel) => (
                        <div key={hotel._id} className="bg-white rounded-lg mb-20 shadow-lg overflow-hidden flex flex-col h-[22rem]">
                            <img src={hotel.coverPhoto} alt={hotel.name} className="w-full h-40 object-cover" />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-700">{hotel.name}</h3>
                                <div className="text-gray-600 text-sm flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-gray-500" /> {hotel.location}
                                </div>
                                <p className="text-gray-700 font-semibold">Rs {hotel.price} / night</p>
                                <p className="text-gray-500 text-sm">⭐ {hotel.rating} / 5</p>
                                <Link
                                    to={`/hotel/${hotel._id}`}
                                    className="mt-auto bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 text-center"
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