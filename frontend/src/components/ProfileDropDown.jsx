import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileAvatar from '../assets/profile-avatar.png';
import { useAuth } from '../User/AuthContext';

function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  const toggleDropdown = () => setOpen(!open);
  const closeDropdown = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLoggedIn = !!user;
  const userAvatar = profileAvatar;

  // Map roles to dashboard routes
  const getDashboardLink = () => {
    switch (user?.role) {
      case 'transport-management':
        return { path: '/transport-admin-dashboard', label: 'Transport Dashboard' };
      case 'hotel-management':
        return { path: '/hotel-admin-dashboard', label: 'Hotel Dashboard' };
      case 'event-management':
        return { path: '/event', label: 'Event Dashboard' };
      case 'financial-management':
        return { path: '/admin-dashboard', label: 'Financial Dashboard' };
      case 'destination-management':
        return { path: '/destination-dashboard', label: 'Destination Dashboard' };
      default:
        return null; // No dashboard for 'user' role
    }
  };

  const dashboard = getDashboardLink();

  return (
    <div className="relative" ref={dropdownRef}>
      {isLoggedIn ? (
        <>
          <button onClick={toggleDropdown} className="focus:outline-none">
            <img src={userAvatar} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md shadow-lg z-50">
              {dashboard && (
                <Link
                  to={dashboard.path}
                  onClick={closeDropdown}
                  className="block py-2 px-4 text-white hover:bg-purple-700 font-poppins"
                >
                  {dashboard.label}
                </Link>
              )}
              <Link
                to="/payment-history"
                onClick={closeDropdown}
                className="block py-2 px-4 text-white hover:bg-purple-700 font-poppins"
              >
                Payment
              </Link>
            </div>
          )}
        </>
      ) : (
        <Link
          to="/destination"
          className="ml-4 text-violet-700 hover:text-violet-800 font-bold font-poppins"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}

export default ProfileDropdown;