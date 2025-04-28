import React from "react";
import wc1 from "../../assets/wc1.webp";
import wc2 from "../../assets/wc2.webp";

const TourPackages = () => {
  const packages = [
    {
      price: "$99",
      title: "Turkey Tour",
      description: "We don’t just work with concrete. We are approachable.",
      features: ["Generation Technology", "Audio Performance", "Generation Technology", "Generation Technology"],
      images: [wc1, wc2],
    },
    {
      price: "$79",
      title: "Full Travel",
      description: "We don’t just work with concrete. We are approachable.",
      features: ["Generation Technology", "Generation Technology", "Audio Performance", "Generation Technology"],
      images: [wc1, wc1],
    },
    {
      price: "$49",
      title: "World Tour",
      description: "We don’t just work with concrete. We are approachable.",
      features: ["Generation Technology", "Generation Technology", "Audio Performance", "Generation Technology"],
      images: [wc1, wc1],
    },
  ];

  return (
    <div className="flex justify-center items-center gap-10 bg-gray-100 min-h-screen">
      {packages.map((pkg, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl shadow-lg p-8 w-100 pt-13 pb-13"
        >
          {/* Price */}
          <div className="text-4xl font-bold text-black">
            {pkg.price}
            <span className="text-sm font-normal text-gray-600"> /month</span>
          </div>

          {/* Images */}
          <div className="flex space-x-3 my-4">
            {pkg.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={pkg.title}
                className="w-14 h-14 rounded-full object-cover"
              />
            ))}
          </div>

          {/* Title & Description */}
          <h3 className="text-2xl font-bold text-black">{pkg.title}</h3>
          <p className="text-sm text-gray-500 mt-2">{pkg.description}</p>

          {/* Features */}
          <ul className="mt-4 space-y-2">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-center space-x-2 text-black font-medium">
                <span className="text-purple-500">✔️</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Button */}
          <button className="bg-black text-white w-full py-3 mt-6 rounded-full text-lg font-semibold hover:bg-gray-800 transition">
            Get Started
          </button>
        </div>
      ))}
    </div>
  );
};

export default TourPackages;
