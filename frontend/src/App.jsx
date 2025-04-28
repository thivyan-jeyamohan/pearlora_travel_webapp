
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./Pages/Home";
import Signup from "./User/Signup";
import Login from "./User/Login";
import { useAuth } from "./User/AuthContext"; // Import the hook
import ProtectedRoute from "./components/ProtectedRoute";
import Transport from "./Feature/Transport/Transport";
import Destination from "./Feature/Destination/Destination";
import Event from "./Feature/Event/Event";
import Financial from "./Feature/Financial/Financial";
import Hotel from "./Feature/Hotel/Hotel";
import Header from "./components/header";
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



function App() {

  const { isAuthenticated } = useAuth(); // Access the authentication state
  const location = useLocation(); // Access the current route

  const hideHeaderRoutes = [
    "/login",
    "/signup",
   
  ]; 

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>

    {!shouldHideHeader && (
      <div className="fixed top-0 left-0 w-full shadow-lg z-50">
        <Header />
      </div>
    )}

    <BrowserRouter>
      <div className='fixed top-0 left-0 w-full shadow-lg z-50'>
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/tours/kandy" element={<Kandy />} />
        <Route path="/booking/form" element={<BookingForm />} />
        <Route path="/admin/form" element={<DestinationList />} />
       
        <Route path="/dashboard" element={<DestinationDashboard />} />
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>

    </>
  );
}

export default App;
