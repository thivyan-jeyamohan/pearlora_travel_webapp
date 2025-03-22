import React, { useState } from 'react';
import HotelManagement from './HotelManagement';
import RoomManagement from './RoomManagement';
import BookingManagement from './BookingManagement';
import Overview from './Overview';

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="flex h-screen mt-20">
      {/* Sidebar */}
      <div className="w-64 text-white min-h-screen p-4" style={{ backgroundColor: "#8A2BE2" }}>
        <h2 className="text-xl font-bold mb-6">Manager Dashboard</h2>
        <ul>
          <li>
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full text-left py-2 px-4 hover:bg-purple-700 cursor-pointer ${
                activeSection === 'overview' ? 'bg-purple-600' : ''
              }`}
              aria-label="Overview"
            >
              Overview
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('hotelManagement')}
              className={`w-full text-left py-2 px-4 hover:bg-purple-700 cursor-pointer ${
                activeSection === 'hotelManagement' ? 'bg-purple-600' : ''
              }`}
              aria-label="Hotel Management"
            >
              Hotel Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('roomManagement')}
              className={`w-full text-left py-2 px-4 hover:bg-purple-700 cursor-pointer ${
                activeSection === 'roomManagement' ? 'bg-purple-600' : ''
              }`}
              aria-label="Room Management"
            >
              Room Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('bookingManagement')}
              className={`w-full text-left py-2 px-4 hover:bg-purple-700 cursor-pointer ${
                activeSection === 'bookingManagement' ? 'bg-purple-600' : ''
              }`}
              aria-label="Booking Management"
            >
              Booking Management
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {activeSection === 'overview' && <Overview />}
        {activeSection === 'hotelManagement' && <HotelManagement />}
        {activeSection === 'roomManagement' && <RoomManagement />}
        {activeSection === 'bookingManagement' && <BookingManagement />}
      </div>
    </div>
  );
};

export default ManagerDashboard;
