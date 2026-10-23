import React from "react";
import heroImg from "../../assets/Hero3.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroImg}
        alt="Martify Vacation Ready Collection"
        className="w-full h-[450px] md:h-[600px] lg:h-[700px] object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-center pb-14 md:pb-16">
        <div className="text-center text-white px-4 max-w-3xl">
          <span className="inline-block px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase tracking-widest rounded-full mb-3 shadow">
            Summer Season 2026
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase mb-4 text-white drop-shadow-lg">
            Vacation Ready
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-8 text-gray-200 drop-shadow max-w-xl mx-auto">
            Explore our handcrafted vacation-ready outfits with fast worldwide shipping and easy 30-day returns.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/collections/all"
              className="bg-white text-gray-950 px-8 py-3.5 rounded-lg text-base font-bold hover:bg-yellow-400 hover:text-black transition duration-200 shadow-xl"
            >
              Shop Collection
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              className="bg-black/60 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-lg text-base font-semibold hover:bg-white hover:text-black transition duration-200"
            >
              Explore Tops
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
