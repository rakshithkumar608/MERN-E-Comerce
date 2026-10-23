import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaFilter } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { fetchProductsByFilters } from "../redux/slices/productsSlice.js";
import FilterSidebar from "../components/Products/FilterSidebar.jsx";
import SortOptions from "../components/Products/SortOptions.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    dispatch(
      fetchProductsByFilters({
        collection: collection !== "all" ? collection : undefined,
        category: params.category,
        gender: params.gender,
        color: params.color,
        size: params.size,
        material: params.material,
        brand: params.brand,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        sortBy: params.sortBy,
        search: params.search,
      })
    );
  }, [dispatch, collection, searchParams]);

  const getPageTitle = () => {
    const search = searchParams.get("search");
    if (search) return `Search Results for "${search}"`;
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");
    if (gender && category) return `${gender}'s ${category}`;
    if (gender) return `${gender}'s Collection`;
    if (category) return category;
    if (collection && collection !== "all") return `${collection} Collection`;
    return "All Collections";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-gray-900 tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {products?.length || 0} items
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter toggle button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <FaFilter className="text-xs" />
            <span>Filter</span>
          </button>

          {/* Sort Options */}
          <SortOptions />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile filter drawer overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Component */}
        <aside
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:shadow-none lg:transform-none lg:border-r lg:pr-6 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <h3 className="font-bold text-gray-900">Filters</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-gray-500 hover:text-black"
            >
              <IoMdClose className="h-6 w-6" />
            </button>
          </div>
          <div className="h-full overflow-y-auto">
            <FilterSidebar />
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          <ProductGrid products={products} loading={loading} error={error} />
        </main>
      </div>
    </div>
  );
};

export default CollectionPage;
