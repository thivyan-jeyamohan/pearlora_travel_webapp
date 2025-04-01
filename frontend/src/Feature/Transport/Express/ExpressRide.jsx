import { useState } from "react";
import ExpressIntro from "./ExpressIntro";
import TravelList from "./TravelList";
import Footer from '../../../components/Footer';

const ExpressRide = () => {
  const [filters, setFilters] = useState({
    departure: "",
    destination: "",
    date: "",
  });

  return (
    <>
      <ExpressIntro onFilterChange={setFilters} />
      <TravelList filters={filters} />
      <div className="mt-20"></div>
      <Footer />
    </>
  );
};

export default ExpressRide;
