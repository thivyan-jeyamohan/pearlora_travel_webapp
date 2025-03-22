import React from 'react'
import { useEffect, useState } from 'react';
import API from './services/api';
import introImage from './images/intro.png'

const Hotel = () => {
    const [hotels, setHotels] = useState([]);
    const [location, setLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch hotels with search or location filter
    const fetchHotels = async () => {
        const { data } = await API.get(`/hotels`, { params: { location: searchQuery || location } });
        setHotels(data);
    };

    useEffect(() => {
        fetchHotels();
    }, [location, searchQuery]);

    return (
        <div>
            <header className="text-center py-4">
                <h1 className="text-4xl">Welcome to Our Hotel Booking</h1>
                <p>Your perfect stay is just a search away</p>
            </header>

            <div className="relative cover-photo">
              <img src={introImage} alt="Hotel Cover" className="w-full h-100 object-cover" />

              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 className="text-white text-3xl font-bold shadow-lg">SEARCH FOR A HOTEL</h2>
                <h3 className="text-white text-base font-bold shadow-lg">Get The Best Deals & Offers</h3>
              </div>
            </div>


            <div className="search-filter mt-4 p-4">
                <input
                    type="text"
                    placeholder="Search by location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 w-1/3"
                />
                <select
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    className="border p-2 ml-4"
                >
                    <option value="">Select Location</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Matara">Matara</option>
                    <option value="Galle">Galle</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Batticaloa">Batticaloa</option>
                    <option value="Vavuniya">Vavuniya</option>
                    <option value="Mullaitivu">Mullaitivu</option>
                    <option value="Monaragala">Monaragala</option>
                    <option value="Puttalam">Puttalam</option>
                    <option value="Rathnapura">Rathnapura</option>
                    <option value="Trincomalee">Trincomalee</option>
                    <option value="Polonnaruwa">Polonnaruwa</option>
                    <option value="Kegalle">Kegalle</option>
                    <option value="Matale">Matale</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Hambantota">Hambantota</option>
                    <option value="Kilinochchi">Kilinochchi</option>
                    <option value="Ampara">Ampara</option>
                    <option value="Mannar">Mannar</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Kalutara">Kalutara</option>

                </select>
            </div>

            <div className="hotel-list grid grid-cols-3 gap-4 mt-4">
                {hotels.map((hotel) => (
                    <div key={hotel._id} className="hotel-card border p-4 rounded shadow-md">
                        <img src={hotel.coverPhoto} alt={hotel.name} className="w-full h-40 object-cover" />
                        <h3 className="text-xl mt-2">{hotel.name}</h3>
                        <p>{hotel.location}</p>
                        <p>${hotel.price} per night</p>
                        <p>{hotel.rating} stars</p>
                        <button
                            onClick={() => window.location.href = `/hotel/${hotel._id}`}
                            className="btn btn-primary mt-2"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hotel;
