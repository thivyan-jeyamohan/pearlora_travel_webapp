import React, { useState, useEffect } from 'react';
import HotelTable from './HotelTable';
import HotelForm from './HotelForm';
import API from './services/api';

const HotelManagement = () => {
const [hotels, setHotels] = useState([]);
const [showHotelForm, setShowHotelForm] = useState(false);
const [selectedHotel, setSelectedHotel] = useState(null);

useEffect(() => {
fetchHotels();
}, []);

const fetchHotels = async () => {
try {
    const response = await API.get('/hotels');
    setHotels(response.data);
} catch (error) {
    console.error('Error fetching hotels:', error);
}
};

const handleAddHotelClick = () => {
setSelectedHotel(null);
setShowHotelForm(true);
};

const handleCloseForm = () => {
setShowHotelForm(false);
setSelectedHotel(null);
};

const handleHotelSaved = () => {
fetchHotels();
handleCloseForm();
};

const handleEditHotel = (hotel) => {   
setSelectedHotel(hotel);
setShowHotelForm(true);
};

return (
<div className="p-6">
    <div className="flex items-center justify-between mb-4">
    <h1 className="text-3xl font-semibold">Hotel Management</h1>
    {!showHotelForm && (
        <button
        onClick={handleAddHotelClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
        Add New Hotel
        </button>
    )}
    </div>

    {showHotelForm ? (
    <HotelForm
        hotelData={selectedHotel}
        onClose={handleCloseForm}
        fetchHotels={fetchHotels}
        onHotelSaved={handleHotelSaved}
    />
    ) : (
    <HotelTable
        hotels={hotels}
        fetchHotels={fetchHotels}
        onEdit={handleEditHotel}  
    />
    )}
</div>
);
};

export default HotelManagement;