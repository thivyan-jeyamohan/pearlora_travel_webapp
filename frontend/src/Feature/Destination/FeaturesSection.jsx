import React from "react";

const features = [
  {
    icon: "/images/icon-globe.png", // Update with the correct image path
    title: "Discover the possibilities",
    description:
      "With nearly half a million attractions, hotels & more, you're sure to find joy.",
  },
  {
    icon: "/images/icon-deals.png", // Update with the correct image path
    title: "Enjoy deals & delights",
    description:
      "Quality activities. Great prices. Plus, earn credits to save more.",
  },
  {
    icon: "/images/icon-exploring.png", // Update with the correct image path
    title: "Exploring made easy",
    description:
      "Book last minute, skip lines & get free cancellation for easier exploring.",
  },
  {
    icon: "/images/icon-trust.png", // Update with the correct image path
    title: "Travel you can trust",
    description:
      "Read reviews & get reliable customer support. We're with you at every step.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Icon */}
              <img src={feature.icon} alt={feature.title} className="w-16 h-16 mb-4" />

              {/* Title */}
              <h3 className="text-lg font-semibold">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
