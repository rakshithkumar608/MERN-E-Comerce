import React from "react";
import { Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";

const ProductGrid = ({ products = [], loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-4">
            <div className="h-56 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold mb-2">Failed to load products</p>
        <p className="text-gray-500 text-sm">{typeof error === "string" ? error : "An error occurred"}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4 text-2xl">🛍️</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">No products found</h3>
        <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 py-4">
      {products.map((product) => {
        const imageUrl =
          product.images?.[0]?.url ||
          product.image ||
          "https://picsum.photos/500/500?random=1";

        return (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group block bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Image wrapper */}
            <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              {product.discountPrice && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow">
                  Sale
                </span>
              )}
              {product.rating > 0 && (
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-xs font-semibold text-gray-800 flex items-center gap-1 shadow-xs">
                  <FiStar className="text-yellow-500 fill-yellow-500 h-3 w-3" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="p-3.5">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1 truncate">
                {product.brand || product.category || "Martify"}
              </p>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-gray-900">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {product.discountPrice && product.discountPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{Number(product.discountPrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
