import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./User/AuthContext"; // Import the hook

import Home from "./Pages/Home";
import { BrowserRouter } from 'react-router-dom';
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
import UserDashboards from "./Pages/User/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutUsSection from "./components/AboutUs"
import Kandy from "./Feature/Destination/TourCardSlider/Kandy";
import BookingForm from "./Feature/Destination/TourCardSlider/BookingForm";
import DestinationList from "./Feature/Destination/TourCardSlider/DestinationList";

import DestinationDashboard from "./Feature/Destination/dashboard";
import DestList from "./Feature/Destination/retrive/desList";
import DestinationDetails from "./Feature/Destination/retrive/DestinationDetails";
import Edit from "./Feature/Destination/Dashboard/EditDestination";
import remove from "./Feature/Destination/Dashboard/RemoveDestination";
import BookingList from "./Feature/Destination/Dashboard/userList";
import Report from "./Feature/Destination/Dashboard/report";


import Navbar from './components/Navbar';
import PaymentPage from './pages/PaymentPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentHistory from './pages/PaymentHistory';
import Bills from './pages/Bills';

import ManagerDashboard from "./Feature/Hotel/ManagerDashboard";
import HotelDetail from "./Feature/Hotel/HotelDetail";
import BookingFormPage from './Feature/Hotel/BookingForm';
import AIChatbot from "./Feature/Hotel/AIChatbot";
import ScrollToTop from './components/ScrollToTop';


function App() {
  const { isAuthenticated } = useAuth(); // Access the authentication state
  const location = useLocation(); // Access the current route

  const hideHeaderRoutes = [
    "/login",
    "/signup",
    "/transport-admin-seatbook/:travelId",
  ];

  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    location.pathname.startsWith(route.replace(":travelId", "")),
  );

  return (
    <>
       <ScrollToTop />
      {!shouldHideHeader && (
        <div className="fixed top-0 left-0 w-full shadow-lg z-50">
          <Header />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/tours/kandy" element={<Kandy />} />
        <Route path="/booking/form" element={<BookingForm />} />
        <Route path="/admin/form" element={<DestinationList />} />
        <Route path="/destination-dashboard" element={<DestinationDashboard />} />
        <Route path="/deshList" element={<DestList />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/edit-destination/:id" element={<Edit />} />
        <Route path="/remove-destinations" element={<remove />} />
        <Route path="/bookings/:id" element={<BookingList />} />
        <Route path="/report" element={<Report />} />
        <Route path="/event" element={<Event />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/Financial" element={<Financial />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/express-ride" element={<ExpressRide />} />
        <Route path="/about-us" element={<AboutUsSection />} />


        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/bills" element={<Bills />} />

        <Route path="/hotel" element={<Hotel />} />
        <Route path="/hotel/:hotelId" element={<HotelDetail />} />
        <Route path="/booking/:hotelId" element={<BookingFormPage />} />
        <Route path="/hotelChatbot" element={<AIChatbot standalone={true} />} />


        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/transport/express-ride/seat-booking"
          element={<SeatBooking />}
        />
        <Route
          path="/transport/express-ride/seat-booking/:travelId"
          element={<SeatBooking />}
        />

        {/* Protected Routes */}
        <Route path="/transport-admin-seatbook" element={<SeatBook />} />
        <Route
          path="/transport-admin-seatbook/:travelId"
          element={<SeatBook />}
        />
        <Route path="/user-dashboard" element={<UserDashboards />} />

        {/* Protected Transport Admin Dashboard Route */}
        <Route
          path="/transport-admin-dashboard"
          element={
            isAuthenticated ? <TransportDashboard /> : <Navigate to="/login" />
          }
        />

        <Route 
          path="/hotel-admin-dashboard" 
          element={isAuthenticated ? <ManagerDashboard />: <Navigate to="/login" />
          } 
        />

      </Routes>
    </>
  );
}

export default App;
