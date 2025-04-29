import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import 'swiper/css/autoplay';

import Footer from '../../components/Footer';
import eventIntro from './image/event1.jpeg'; // replace with your image


const Event = () => {
  const events = [
    {
      id: 1,
      name: "Beachside Music Festival",
      location: "Galle",
      price: 3000,
      rating: 4.7,
      coverPhoto:  eventIntro,
    },
    {
      id: 2,
      name: "Corporate Networking Night",
      location: "Colombo",
      price: 2000,
      rating: 4.5,
      coverPhoto:  eventIntro,
    },
    {
      id: 3,
      name: "Wedding Expo 2025",
      location: "Kandy",
      price: 1500,
      rating: 4.8,
      coverPhoto:  eventIntro,
    },
    {
      id: 4,
      name: "Cultural Food Fiesta",
      location: "Negombo",
      price: 2500,
      rating: 4.6,
      coverPhoto:  eventIntro,
    },
    {
      id: 5,
      name: "Tech Innovators Summit",
      location: "Colombo",
      price: 4000,
      rating: 4.9,
      coverPhoto:  eventIntro,
    },
    {
      id: 6,
      name: "Beachside Music Carnival",
      location: "Galle",
      price: 3000,
      rating: 4.7,
      coverPhoto: eventIntro,
    },
    {
      id: 7,
      name: "Art & Craft Expo",
      location: "Kurunegala",
      price: 1200,
      rating: 4.4,
      coverPhoto: eventIntro,
    },
    {
      id: 8,
      name: "Startup Pitch Night",
      location: "Jaffna",
      price: 2000,
      rating: 4.5,
      coverPhoto: eventIntro,
    },
    {
      id: 9,
      name: "Eco Travel Fair",
      location: "Nuwara Eliya",
      price: 1800,
      rating: 4.6,
      coverPhoto: eventIntro,
    },
    {
      id: 10,
      name: "Dance & Fashion Gala",
      location: "Matara",
      price: 2200,
      rating: 4.8,
      coverPhoto: eventIntro,
    }
    
    
     
             
    // Add more static events here
  ];

  return (
    <>
      <style global="true">{`
        .swiper-button-prev,
        .swiper-button-next {
          display: none !important;
        }
      `}</style>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-opensans relative mt-26">
        <section className="py-16 md:py-20 px-6 md:px-20 bg-gray-300 rounded-3xl md:mt-10 mx-0 md:mx-auto max-w-7xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
            <div className="text-center md:text-left">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5 leading-tight font-poppins">
                Unforgettable Events Tailored for You
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 mb-8 font-opensans">
                From corporate galas to weddings, experience perfection with our expert event planning.
              </p>
              <a href="#event-listings" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out font-opensans text-base">
                Explore Events
              </a>
            </div>
            <div className="flex justify-center md:justify-end mt-8 md:mt-0">
              <img src={eventIntro} alt="Event Intro" className="rounded-2xl shadow-xl w-full max-w-sm md:max-w-md lg:max-w-lg object-cover transform transition duration-300 hover:scale-105" />
            </div>
          </div>
        </section>

        <div id="event-listings" className="container mx-auto mt-20 px-4 sm:px-6 lg:px-10 xl:px-16 relative mb-20">
          <div className="relative">
            <button aria-label="Previous slide" className="absolute top-1/2 transform -translate-y-1/2 left-[-30px] z-20 bg-white text-gray-700 rounded-full shadow-lg p-2 hover:bg-gray-100 transition">
              <ChevronLeft size={28} />
            </button>
            <button aria-label="Next slide" className="absolute top-1/2 transform -translate-y-1/2 right-[-30px] z-20 bg-white text-gray-700 rounded-full shadow-lg p-2 hover:bg-gray-100 transition">
              <ChevronRight size={28} />
            </button>

            <Swiper
              modules={[Navigation, Autoplay, Grid]}
              navigation={true}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = swiper.el.previousSibling;
                swiper.params.navigation.nextEl = swiper.el.nextSibling;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              grid={{ rows: 2, fill: 'row' }}
              spaceBetween={24}
              autoplay={{ delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true }}
              breakpoints={{
                320: { slidesPerView: 1, grid: { rows: 2 }, spaceBetween: 16 },
                640: { slidesPerView: 2, grid: { rows: 2 }, spaceBetween: 20 },
                1024: { slidesPerView: 3, grid: { rows: 2 }, spaceBetween: 24 },
                1280: { slidesPerView: 4, grid: { rows: 2 }, spaceBetween: 24 },
              }}
              className="pb-6 pt-2"
            >
              {events.map((event) => (
                <SwiperSlide key={event.id} style={{ height: 'auto' }} className="self-stretch mb-6 p-1">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg flex flex-col h-full transition-shadow duration-300 font-opensans group max-w-xs mx-auto">
                    <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                      <img src={event.coverPhoto} alt={event.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-base font-semibold text-gray-800 font-poppins mb-1 truncate" title={event.name}>
                        {event.name}
                      </h3>
                      <div className="text-gray-600 text-xs flex items-center mt-1 mb-2" title={event.location}>
                        <FaMapMarkerAlt className="mr-1.5 text-gray-400 flex-shrink-0" size={12} />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <p className="text-gray-700 font-semibold text-sm my-1">LKR {event.price.toLocaleString()} / entry</p>
                      <p className="text-gray-500 text-sm">⭐ {event.rating} / 5</p>
                      <button className="mt-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        

        <Footer />
      </div>
    </>
  );
};

export default Event;
