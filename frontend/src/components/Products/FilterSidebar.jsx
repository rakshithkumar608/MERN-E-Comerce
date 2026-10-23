import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 2000,
  });

  const [priceRange, setPriceRange] = useState([0, 2000]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "White",
    "Gray",
    "Pink",
    "Navy",
    "Burgundy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Polyester", "Silk", "Linen", "Denim", "Wool"];
  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Peter England",
    "Greciilooks",
    "IndoPrimo",
  ];
  const genders = ["Men", "Women", "Unisex"];

  // Load params into state
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: Number(params.minPrice) || 0,
      maxPrice: Number(params.maxPrice) || 2000,
    });

    setPriceRange([0, Number(params.maxPrice) || 2000]);
  }, [searchParams]);

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams(searchParams);

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.set(key, newFilters[key].join(","));
      } else if (newFilters[key] && !Array.isArray(newFilters[key])) {
        params.set(key, newFilters[key]);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  };

  const handleCheckboxChange = (name, value) => {
    const currentList = filters[name] || [];
    const exists = currentList.includes(value);
    const updated = exists
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];

    const newFilters = { ...filters, [name]: updated };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleRadioChange = (name, value) => {
    const newValue = filters[name] === value ? "" : value;
    const newFilters = { ...filters, [name]: newValue };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e) => {
    const newMax = Number(e.target.value);
    setPriceRange([0, newMax]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newMax };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleResetFilters = () => {
    const reset = {
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 2000,
    };
    setFilters(reset);
    setPriceRange([0, 2000]);
    const params = new URLSearchParams();
    if (searchParams.get("search")) {
      params.set("search", searchParams.get("search"));
    }
    setSearchParams(params);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b">
        <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">
          Filters
        </h3>
        <button
          onClick={handleResetFilters}
          className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
          Category
        </h4>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center text-sm text-gray-600 hover:text-black cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => handleRadioChange("category", cat)}
                className="mr-2 accent-black cursor-pointer"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
          Gender
        </h4>
        <div className="space-y-1.5">
          {genders.map((g) => (
            <label
              key={g}
              className="flex items-center text-sm text-gray-600 hover:text-black cursor-pointer"
            >
              <input
                type="radio"
                name="gender"
                checked={filters.gender.toLowerCase() === g.toLowerCase()}
                onChange={() => handleRadioChange("gender", g)}
                className="mr-2 accent-black cursor-pointer"
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Max Price
          </h4>
          <span className="text-xs font-bold text-gray-900">₹{priceRange[1]}</span>
        </div>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full accent-black cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>₹100</span>
          <span>₹2,000</span>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
          Sizes
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => {
            const isSelected = filters.size.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleCheckboxChange("size", s)}
                className={`px-3 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
          Colors
        </h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const isSelected = filters.color === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => handleRadioChange("color", c)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-black text-white border-black font-bold"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
          Brand
        </h4>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label
              key={b}
              className="flex items-center text-sm text-gray-600 hover:text-black cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.brand.includes(b)}
                onChange={() => handleCheckboxChange("brand", b)}
                className="mr-2 accent-black rounded cursor-pointer"
              />
              <span className="truncate">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
          Material
        </h4>
        <div className="space-y-1.5">
          {materials.map((m) => (
            <label
              key={m}
              className="flex items-center text-sm text-gray-600 hover:text-black cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.material.includes(m)}
                onChange={() => handleCheckboxChange("material", m)}
                className="mr-2 accent-black rounded cursor-pointer"
              />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
