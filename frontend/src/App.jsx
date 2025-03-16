import Home from "./Pages/Home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Transport from "./Feature/Transport/Transport";
import Destination from "./Feature/Destination/Destination";
import Event from "./Feature/Event/Event";
import Financial from "./Feature/Financial/Financial";
import Hotel from "./Feature/Hotel/Hotel";
import Header from "./components/header";
import ExpressRide from "./Feature/Transport/Express/ExpressRide";
import Dashboard from "./Feature/Transport/Admin/Dashboard";
import Signup from "./User/Signup";
import Login from "./User/Login";
import SeatBooking from "./Feature/Transport/Express/SeatBooking";





function App() {
  return (
    <BrowserRouter>
      <div className='fixed top-0 left-0 w-full shadow-lg z-50'><Header /></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/event" element={<Event />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/Financial" element={<Financial />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/express-ride" element={<ExpressRide/>} />
        <Route path="/transport-dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/transport/express-ride/seat-booking" element={<SeatBooking />} />
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
