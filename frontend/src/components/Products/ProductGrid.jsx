import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error
 }) => {
  if(loading) {
    return <p>Loading...</p>;
  }

  if (error){
    return <p className="text-red-500">Error: {error}</p>
  }
  return (
    <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link
          key={index}
          to={`/product/${product._id}`}
          className="block group"
        >
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-3 ">
            {/* Image wrapper with fixed height */}
            <div className="w-full h-64 mb-3 overflow-hidden rounded-xl flex items-center justify-center bg-gray-50">
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product details */}
            <h3 className="text-sm font-medium text-gray-800 mb-1 truncate">
              {product.name}
            </h3>
            <p className="text-gray-600 font-semibold text-sm">
              ₹ {product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
