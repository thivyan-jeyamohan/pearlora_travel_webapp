import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHotel, faBed, faClipboardList, faChartBar } from '@fortawesome/free-solid-svg-icons';
import HotelManagement from './HotelManagement';
import RoomManagement from './RoomManagement';
import BookingManagement from './BookingManagement';
import Overview from './Overview';
import HotelDetail from "./HotelDetail";
import Reports from './Reports'; 

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [fetchBookingsFromDashboard, setFetchBookingsFromDashboard] = useState(null);

  const handleFetchBookingsCallback = useCallback((fetchBookings) => {
    setFetchBookingsFromDashboard(() => fetchBookings);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 mt-20">
      {/* Sidebar */}
      <div className="w-64 text-white min-h-screen p-6" style={{ backgroundColor: "#8A2BE2" }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Manager Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveSection('overview')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-purple-700 rounded-lg cursor-pointer ${activeSection === 'overview' ? 'bg-purple-600' : ''}`}
              aria-label="Overview"
            >
              <FontAwesomeIcon icon={faHome} className="mr-3" />
              Overview
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('hotelManagement')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-purple-700 rounded-lg cursor-pointer ${activeSection === 'hotelManagement' ? 'bg-purple-600' : ''}`}
              aria-label="Hotel Management"
            >
              <FontAwesomeIcon icon={faHotel} className="mr-3" />
              Hotel Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('roomManagement')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-purple-700 rounded-lg cursor-pointer ${activeSection === 'roomManagement' ? 'bg-purple-600' : ''}`}
              aria-label="Room Management"
            >
              <FontAwesomeIcon icon={faBed} className="mr-3" />
              Room Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('bookingManagement')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-purple-700 rounded-lg cursor-pointer ${activeSection === 'bookingManagement' ? 'bg-purple-600' : ''}`}
              aria-label="Booking Management"
            >
              <FontAwesomeIcon icon={faClipboardList} className="mr-3" />
              Booking Management
            </button>
          </li>
           <li>
            <button
              onClick={() => setActiveSection('reports')}
              className={`flex items-center w-full text-left py-2 px-4 hover:bg-purple-700 rounded-lg cursor-pointer ${activeSection === 'reports' ? 'bg-purple-600' : ''}`}
              aria-label="Reports"
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-3" />
              Reports
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeSection === 'overview' && <Overview />}
          {activeSection === 'hotelManagement' && <HotelManagement />}
          {activeSection === 'roomManagement' && <RoomManagement />}
          {activeSection === 'bookingManagement' && (
            <BookingManagement setFetchBookingsFromDashboard={handleFetchBookingsCallback} />
          )}
           {activeSection === 'reports' && <Reports />}
          {activeSection === 'hotel' && fetchBookingsFromDashboard && (
            <HotelDetail fetchBookings={fetchBookingsFromDashboard} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;