import { useState } from "react";
import ExpressIntro from "./ExpressIntro";
import TravelList from "./TravelList";

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
    </>
  );
};

export default ExpressRide;
