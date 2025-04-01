import Home from "./Pages/Home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Transport from "./Feature/Transport/Transport";
import Destination from "./Feature/Destination/Destination";
import Event from "./Feature/Event/Event";
import Financial from "./Feature/Financial/Financial";
import Hotel from "./Feature/Hotel/Hotel";
import Header from "./components/header";
import Kandy from "./Feature/Destination/TourCardSlider/Kandy";
import BookingForm from "./Feature/Destination/TourCardSlider/BookingForm";
import DestinationList from "./Feature/Destination/TourCardSlider/DestinationList";
import AdminDashboard from "./Feature/Destination/AdminDashboard";
import Dashboard from "./Feature/Destination/dashboard";
import DestList from "./Feature/Destination/retrive/desList";
import DestinationDetails from "./Feature/Destination/retrive/DestinationDetails";
import Edit from "./Feature/Destination/Dashboard/EditDestination";
import remove from "./Feature/Destination/Dashboard/RemoveDestination";
import BookingList from "./Feature/Destination/Dashboard/userList";
import Report from "./Feature/Destination/Dashboard/report";

function App() {
  return (
    <BrowserRouter>
      <div className='fixed top-0 left-0 w-full shadow-lg z-50'><Header /></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/tours/kandy" element={<Kandy />} />
        <Route path="/booking/form" element={<BookingForm />} />
        <Route path="/admin/form" element={<DestinationList />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Fixed route */}
        <Route path="/deshList" element={<DestList />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/edit-destination/:id" element={<Edit />} />
        <Route path="/admin-destinations" element={<DestList />} />
        <Route path="/remove-destinations" element={<remove />} />
        <Route path="/bookings/:id" element={<BookingList />} />
        <Route path="/report" element={<Report />} /> 


        <Route path="/event" element={<Event />} />

        
        <Route path="/transport" element={<Transport />} />
        <Route path="/Financial" element={<Financial />} />
        <Route path="/hotel" element={<Hotel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
