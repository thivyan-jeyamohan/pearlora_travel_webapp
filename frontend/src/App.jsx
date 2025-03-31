import Home from "./Pages/Home";
import {Route, Routes,Navigate,useLocation } from 'react-router-dom';
import Transport from "./Feature/Transport/Transport";
import Destination from "./Feature/Destination/Destination";
import Event from "./Feature/Event/Event";
import Financial from "./Feature/Financial/Financial";
import Hotel from "./Feature/Hotel/Hotel";
import Header from "./components/header";
import ManagerDashboard from "./Feature/Hotel/ManagerDashboard";
import HotelDetail from "./Feature/Hotel/HotelDetail";
import BookingFormPage from './Feature/Hotel/BookingForm';
import Signup from "./User/Signup";
import Login from "./User/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from './User/AuthContext';


function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  

  return (
    <>
      <div className="fixed top-0 left-0 w-full shadow-lg z-50">
          <Header />
        </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/event" element={<Event />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/Financial" element={<Financial />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/hotel/:hotelId" element={<HotelDetail />} />
        <Route path="/booking/:hotelId" element={<BookingFormPage />} />
        {/* <Route path="/manager/dashboard" element={<ManagerDashboard />}/> */}

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/hotel-admin-dashboard" element={isAuthenticated ? <ManagerDashboard />: <Navigate to="/login" />} />


      </Routes>
    </>
  );
}

export default App;
