import React, { useEffect, useState } from "react";
import slide1 from "../assets/image1.jpg";
import slide2 from "../assets/image2.jpg";
import slide3 from "../assets/image3.jpg";
import slide4 from "../assets/image4.jpg";
import AvailableRooms from "./AvailableRooms";
// import slide5 from "../assets/image5.jpg";

const images = [slide1, slide2, slide3, slide4];

interface HeroCarouselProps {
  onBookNowClick?: () => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ onBookNowClick }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // slow rotation
    return () => clearInterval(id);
  }, []);


  return (
    <section className="relative h-screen overflow-hidden">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Hotel ambience"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/0" />

      {/* Dots */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />)
        )}
      </div>

      {/* Booking overlay bar */}
      <section className="absolute bottom-0 left-0 right-0 bg-purple-900/90 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-sm opacity-80">Location</label>
            <select className="w-full mt-1 text-gray-900 rounded-md p-2">
              <option>Chennai</option>
              <option>Bengaluru</option>
              <option>Coimbatore</option>
            </select>
          </div>
          <div>
            <label className="text-sm opacity-80">Hotel</label>
            <select className="w-full mt-1 text-gray-900 rounded-md p-2">
              <option>The Residency Towers</option>
              <option>The Residency</option>
            </select>
          </div>
          <div>
            <label className="text-sm opacity-80">Check In</label>
            <input type="date" className="w-full mt-1 text-gray-900 rounded-md p-2" />
          </div>
          <div>
            <label className="text-sm opacity-80">Check Out</label>
            <input type="date" className="w-full mt-1 text-gray-900 rounded-md p-2" />
          </div>
          <div className="flex gap-2">
            <input placeholder="Promo Code" className="flex-1 text-gray-900 rounded-md p-2 mt-6" />
            <button 
              onClick={onBookNowClick}
              className="bg-amber-600 hover:bg-amber-700 rounded-md px-4 py-2 mt-6"
            >
              Book Now
            </button>
          </div>
        </div>
      </section>

    </section>
  );
};

export default HeroCarousel;


