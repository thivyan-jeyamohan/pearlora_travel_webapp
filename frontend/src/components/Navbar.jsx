import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Pearlora" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-purple-800">PEARLORA</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-purple-800">TO BE PAID</Link>
          <Link to="/payment-history" className="text-gray-700 hover:text-purple-800">PAYMENT HISTORY</Link>
            
            <Link to="/admin-dashboard" className="bg-purple-800 text-white px-4 py-2 rounded-full">ADMIN PANEL</Link>
            
            <button className="bg-purple-800 text-white px-4 py-2 rounded-full">Sign In / Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;