import React from "react";
import mensCollectionImage from "../../assets/Mens.webp";
import womensCollectionImage from "../../assets/Womens.webp";
import { Link } from "react-router-dom";

const GenderCollectionSection = () => {
  return (
    <section className="py-8 px-4 lg:px-0">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Women's collection */}
        <div className="relative group overflow-hidden rounded-3xl shadow-sm border border-gray-100">
          <img
            src={womensCollectionImage}
            alt="Women's Collection"
            className="w-full h-[450px] sm:h-[550px] md:h-[600px] object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
            <div className="text-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">
                Trending Now
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Women's Collection
              </h2>
              <p className="text-xs text-gray-200 max-w-sm pb-2">
                Discover tops, shirts, denim, and coordinates designed for versatile comfort.
              </p>
              <Link
                to="/collections/all?gender=Women"
                className="inline-block bg-white text-black px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-yellow-400 transition"
              >
                Shop Women &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Men's collection */}
        <div className="relative group overflow-hidden rounded-3xl shadow-sm border border-gray-100">
          <img
            src={mensCollectionImage}
            alt="Men's Collection"
            className="w-full h-[450px] sm:h-[550px] md:h-[600px] object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
            <div className="text-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">
                New Arrivals
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Men's Collection
              </h2>
              <p className="text-xs text-gray-200 max-w-sm pb-2">
                Classic Oxford shirts, relaxed joggers, and modern everyday essentials.
              </p>
              <Link
                to="/collections/all?gender=Men"
                className="inline-block bg-white text-black px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-yellow-400 transition"
              >
                Shop Men &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
