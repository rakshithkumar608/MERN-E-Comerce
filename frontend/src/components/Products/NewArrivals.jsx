import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewArrivals } from "../../redux/slices/productsSlice.js";

const NewArrivals = () => {
  const dispatch = useDispatch();
  const { newArrivals } = useSelector((state) => state.products);
  const scrollRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const items = newArrivals && newArrivals.length > 0 ? newArrivals : [];

  if (items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Fresh In Stock
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Explore New Arrivals
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2.5 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition cursor-pointer"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2.5 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition cursor-pointer"
            aria-label="Scroll right"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => {
          const imageUrl =
            item.images?.[0]?.url ||
            item.image ||
            "https://picsum.photos/400/500?random=1";

          return (
            <div
              key={item._id}
              className="flex-shrink-0 w-60 sm:w-68 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-md transition duration-200 overflow-hidden group"
            >
              <Link to={`/product/${item._id}`}>
                <div className="relative w-full h-72 sm:h-80 bg-gray-50 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.discountPrice && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow">
                      New
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                    {item.brand || item.category}
                  </p>
                  <h3 className="text-sm font-bold text-gray-900 truncate mb-1.5 group-hover:text-blue-600 transition">
                    {item.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-gray-900">
                      ₹{Number(item.price).toLocaleString()}
                    </span>
                    {item.discountPrice && item.discountPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{Number(item.discountPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NewArrivals;
