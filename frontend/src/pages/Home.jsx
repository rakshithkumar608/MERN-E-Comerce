import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Hero from "../components/Layout/Hero.jsx";
import GenderCollectionSection from "../components/Products/GenderCollectionSection.jsx";
import NewArrivals from "../components/Products/NewArrivals.jsx";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import FeaturedCollection from "../components/Products/FeaturedCollection.jsx";
import FeaturesSection from "../components/Products/FeaturesSection.jsx";
import {
  fetchBestSeller,
  fetchProductsByFilters,
} from "../redux/slices/productsSlice.js";

const Home = () => {
  const dispatch = useDispatch();
  const { products, bestSeller, loading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchBestSeller());
    dispatch(
      fetchProductsByFilters({
        category: "Top Wear",
        limit: 8,
      })
    );
  }, [dispatch]);

  return (
    <div className="space-y-12">
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller Section */}
      {bestSeller && (
        <section className="container mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Customer Favorite
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Best Seller
            </h2>
          </div>
          <ProductDetails productId={bestSeller._id} />
        </section>
      )}

      {/* Top Wear Collection Grid */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Featured Category
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Trending Top Wear
          </h2>
        </div>
        <ProductGrid products={products} loading={loading} />
      </section>

      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
