import React from "react";
import { Link } from "react-router-dom";
import featured from "../../assets/featured.webp";

const FeaturedCollection = () => {
  return (
    <section className="py-12 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-emerald-50/70 border border-emerald-100 rounded-3xl overflow-hidden shadow-xs">
        {/* left content */}
        <div className="lg:w-1/2 p-8 sm:p-12 text-center lg:text-left space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Comfort &amp; Everyday Style
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Apparel Made for Your Everyday Life
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
            Discover high-quality, breathable clothing that effortlessly blends
            modern fashion and utility. Designed to make you look confident and feel great all day.
          </p>

          <div className="pt-2">
            <Link
              to="/collections/all"
              className="inline-block bg-black text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-gray-800 transition shadow-lg active:scale-[0.99]"
            >
              Shop Featured Items
            </Link>
          </div>
        </div>

        {/* right image */}
        <div className="lg:w-1/2 w-full h-[320px] sm:h-[420px] lg:h-[480px]">
          <img
            src={featured}
            alt="Martify Everyday Featured Collection"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
