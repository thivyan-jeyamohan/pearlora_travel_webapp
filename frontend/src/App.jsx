import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from './User/AuthContext'; // Import the hook

import Home from "./Pages/Home";
import Transport from "./Feature/Transport/Basic/Transport";
import Destination from "./Feature/Destination/Destination";
import Event from "./Feature/Event/Event";
import Financial from "./Feature/Financial/Financial";
import Hotel from "./Feature/Hotel/Hotel";
import Header from "./components/header";
import ExpressRide from "./Feature/Transport/Express/ExpressRide";
import Signup from "./User/Signup";
import Login from "./User/Login";
import SeatBooking from "./Feature/Transport/Express/SeatBooking";
import TransportDashboard from "./Feature/Transport/Dashboard/Dashboard";
import SeatBook from "./Feature/Transport/Dashboard/SeatBook";
import UserDashboard from "./Pages/User/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { isAuthenticated } = useAuth(); // Access the authentication state
  const location = useLocation(); // Access the current route

  const hideHeaderRoutes = [
    "/login",
    "/signup",
    "/transport-admin-seatbook/:travelId",
  ];

  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    location.pathname.startsWith(route.replace(":travelId", ""))
  );

  return (
    <>
      {!shouldHideHeader && (
        <div className="fixed top-0 left-0 w-full shadow-lg z-50">
          <Header />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/event" element={<Event />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/Financial" element={<Financial />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/express-ride" element={<ExpressRide />} />
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/transport/express-ride/seat-booking" element={<SeatBooking />} />
        <Route path="/transport/express-ride/seat-booking/:travelId" element={<SeatBooking />} />

        {/* Protected Routes */}
        <Route path="/transport-admin-seatbook" element={<SeatBook />} />
        <Route path="/transport-admin-seatbook/:travelId" element={<SeatBook />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        
        {/* Protected Transport Admin Dashboard Route */}
        <Route path="/transport-admin-dashboard" element={isAuthenticated ? <TransportDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
