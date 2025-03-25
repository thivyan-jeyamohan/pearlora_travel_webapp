import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import Kandy from "./Kandy";

// Import images
import kandy from "../image/Kandy.jpg";
import polonnaruwa from "../image/Polonnaruwa.jpg";
import yala from "../image/yala national park.jpg";
import galle from "../image/Gall_2.jpg";
import Nuwareliya from "../image/Nuwareliya.jpg";
import Anuradhapura from "../image/Anuradhapura.jpg";
import Ella from "../image/Ella.jpg";
import Hikkaduwa from "../image/Hikkaduwa.jpg";
import Horton_Plains_National_Park from "../image/Horton Plains National Park.jpg";
import Minneriya_National_Park from "../image/Minneriya National Park.jpg";
import Negombo from "../image/Negombo.jpg";
import Dambulla_Cave_Temple from "../image/Dambulla Cave Temple.jpg";

// Sample tour data
const tours = [
  { id: 1, title: "Kandy", description: "Explore the cultural heart of Sri Lanka.", location: "Sri Lanka", days: "5 Days", people: "1-5 People", oldPrice: "$3,100", newPrice: "$2,500", image: kandy, link: "/tours/kandy" },
  { id: 2, title: "Polonnaruwa", description: "Discover ancient ruins and history.", location: "Sri Lanka", days: "4 Days", people: "1-5 People", oldPrice: "$2,900", newPrice: "$2,400", image: polonnaruwa, link: "/tours/polonnaruwa" },
  { id: 3, title: "Yala National Park", description: "Experience wildlife and nature.", location: "Sri Lanka", days: "3 Days", people: "1-5 People", oldPrice: "$3,500", newPrice: "$2,800", image: yala, link: "/tours/yala" },
  { id: 4, title: "Galle", description: "Explore the colonial charm of Galle.", location: "Sri Lanka", days: "3 Days", people: "1-5 People", oldPrice: "$3,000", newPrice: "$2,600", image: galle, link: "/tours/galle" },
  { id: 5, title: "Nuwareliya", description: "Enjoy the scenic beauty of the hills.", location: "Sri Lanka", days: "3 Days", people: "1-5 People", oldPrice: "$3,000", newPrice: "$2,600", image: Nuwareliya, link: "/tours/nuwareliya" },
  { id: 6, title: "Anuradhapura", description: "Explore the ancient city of Anuradhapura.", location: "Sri Lanka", days: "3 Days", people: "1-5 People", oldPrice: "$3,000", newPrice: "$2,600", image: Anuradhapura, link: "/tours/anuradhapura" },
  { id: 7, title: "Dambulla Cave Temple", description: "Visit the historic cave temple in Dambulla.", location: "Sri Lanka", days: "3 Days", people: "1-5 People", oldPrice: "$3,000", newPrice: "$2,600", image: Dambulla_Cave_Temple, link: "/tours/dambulla" },
];

const TourCardSlider = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full text-center p-10">
      <h2 className="text-4xl font-bold mb-4">The Journey Of A Lifetime: Create Unforgettable Memories</h2>
      <p className="text-gray-600 mb-8">Get ready to embark on the journey of a lifetime!</p>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          1024: { slidesPerView: 3 }
        }}
      >
        {tours.map((tour) => (
          <SwiperSlide key={tour.id} className="cursor-pointer" onClick={() => navigate(tour.link)}>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="relative">
                <img src={tour.image} alt={tour.title} className="w-full h-64 object-cover" />
                <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full">
                  19% OFF
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{tour.title}</h3>
                <p className="text-gray-600">{tour.description}</p>
                <div className="mt-2 flex justify-between items-center text-gray-700 text-sm">
                  <span>📍 {tour.location}</span>
                  <span>⏳ {tour.days}</span>
                  <span>👥 {tour.people}</span>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-gray-400 line-through">{tour.oldPrice}</span>
                  <span className="text-red-500 text-xl font-bold ml-2">{tour.newPrice}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TourCardSlider;
