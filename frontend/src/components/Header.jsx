import React from 'react';
import profileAvatar from '../assets/profile-avatar.png';
import logo from '../assets/logo.png';
import '../App.css';
import { Link } from 'react-router-dom';
import SimpleDropdown from './SimpleDropDown';
import { useAuth } from '../User/AuthContext';
import ProfileDropdown from './ProfileDropDown';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  

  const handleSignOut = () => {
    logout();
  };

  return (
    <nav className="bg-white py-5 shadow-lg shadow-gray-500/50 font-bold pl-10 pr-10">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Goyto Logo" className="h-8 mr-2" />
            <span className="text-xl font-bold font-poppins">PEARLORA</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 gap-10">
          <Link to="/" className="hover:text-gray-700 font-poppins">
            Home
          </Link>
          <SimpleDropdown />
          <Link to="/about-us" className="hover:text-gray-700 font-poppins">About Us</Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-10">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ProfileDropdown />
                <span className="text-sm">{user?.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-800 font-poppins"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-800 font-poppins"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded-full flex items-center font-poppins"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;