import React from "react";
import user1 from "../../assets/wc1.webp";
import user2 from "../../assets/wc2.webp";

const testimonials = [
  {
    name: "Watson Karm",
    company: "Fementum Odio Co.",
    rating: 5,
    feedback: "We don’t just work with concrete and steel. We are approachable, with even our highest concrete and steel. We work with people concrete",
    image: user1,
    bgColor: "bg-blue-600",
    textColor: "text-white"
  },
  {
    name: "Hamza Khan",
    company: "Fementum Odio Co.",
    rating: 4,
    feedback: "We don’t just work with concrete and steel. We are approachable, with even our highest concrete and steel.",
    image: user2,
    bgColor: "bg-gray-100",
    textColor: "text-black"
  }
];

const TestimonialsSection = () => {
  return (
    <div className="flex items-center justify-between  bg-white  pr-40 pl-80">
      {/* Left Section */}
      <div className="max-w-lg">
        <h4 className="text-lg font-medium text-purple-600">✦ Get To Know Us</h4>
        <h2 className="text-5xl font-bold text-black mt-2">What People Say About Us</h2>
        <p className="text-gray-500 mt-4">We don’t just work with concrete and steel. We are approachable, with even our highest concrete and steel. We work with people.</p>
        <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold mt-6 hover:bg-gray-800 transition">Find Out More</button>
      </div>

      {/* Right Section */}
      <div className="-space-y-30 space-x-50">
        {testimonials.map((testimonial, index) => (
          <div key={index} className={`relative p-8 rounded-3xl shadow-lg w-96 ${testimonial.bgColor}`}>
            <div className="absolute -top-8 left-8">
              <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover border-4 border-white" />
            </div>
            <p className={`mt-8 ${testimonial.textColor}`}>{testimonial.feedback}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="bg-white rounded-full px-4 py-2">
                <h4 className="font-bold text-black">{testimonial.name}</h4>
                <p className="text-gray-500 text-sm">{testimonial.company}</p>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: testimonial.rating }, (_, i) => <span key={i} className="text-yellow-400">⭐</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;