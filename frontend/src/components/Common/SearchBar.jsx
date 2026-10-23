import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        const input = document.getElementById("search-input");
        if (input) input.focus();
      }, 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/collections/all?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <div className="flex items-center">
      {isOpen ? (
        <div className="fixed inset-x-0 top-0 h-20 bg-white border-b shadow-md z-50 flex items-center justify-center px-4">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center justify-center w-full max-w-2xl"
          >
            <div className="relative w-full">
              <input
                id="search-input"
                type="text"
                placeholder="Search products by name, category, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 px-4 py-2.5 pr-20 rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm text-gray-900 placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-800 transition"
              >
                Search
              </button>
            </div>
            <button
              type="button"
              onClick={handleSearchToggle}
              className="ml-3 p-1 text-gray-500 hover:text-black focus:outline-none"
              aria-label="Close search"
            >
              <HiMiniXMark className="h-6 w-6" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={handleSearchToggle}
          className="p-1 hover:text-black focus:outline-none"
          aria-label="Open search"
        >
          <HiMagnifyingGlass className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
