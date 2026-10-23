import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js";
import SearchBar from "./SearchBar.jsx";
import CartDrawer from "../Layout/CartDrawer.jsx";
import logo from "../../assets/logo1.png";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const cartItemCount =
    cart?.products?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  const handleLogout = () => {
    dispatch(logout());
    setNavDrawerOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
        {/* Left - logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Martify"
              className="h-10 w-auto object-contain bg-transparent mix-blend-multiply"
            />
            <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:inline">
              MARTIFY
            </span>
          </Link>
        </div>

        {/* Center - Navigation links */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-semibold tracking-wide uppercase transition-colors"
          >
            Men
          </Link>

          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-semibold tracking-wide uppercase transition-colors"
          >
            Women
          </Link>

          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-semibold tracking-wide uppercase transition-colors"
          >
            Top Wear
          </Link>

          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-semibold tracking-wide uppercase transition-colors"
          >
            Bottom Wear
          </Link>

          <Link
            to="/collections/all"
            className="text-gray-700 hover:text-black text-sm font-semibold tracking-wide uppercase transition-colors"
          >
            All Collections
          </Link>
        </div>

        {/* Right - icons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hidden sm:inline-block bg-black hover:bg-gray-800 px-3 py-1 rounded text-xs font-semibold text-white tracking-wider uppercase transition-colors"
            >
              Admin Panel
            </Link>
          )}

          <Link
            to={user ? "/profile" : "/login"}
            className="hover:text-black flex items-center text-sm font-medium text-gray-700"
            title={user ? `Profile (${user.name})` : "Login"}
          >
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
            {user && (
              <span className="ml-1 text-xs hidden lg:inline max-w-[80px] truncate font-semibold">
                {user.name.split(" ")[0]}
              </span>
            )}
          </Link>

          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black focus:outline-none"
            aria-label="Shopping Cart"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#ea2e0e] text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Search */}
          <div className="overflow-visible">
            <SearchBar />
          </div>

          <button
            onClick={toggleNavDrawer}
            className="md:hidden focus:outline-none p-1"
            aria-label="Open Menu"
          >
            <HiBars3BottomRight className="h-7 w-7 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile navigation overlay */}
      {navDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={toggleNavDrawer}
        />
      )}

      {/* Mobile navigation drawer */}
      <div
        className={`fixed top-0 left-0 w-4/5 sm:w-2/3 max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-extrabold text-lg text-gray-900">MENU</span>
          <button onClick={toggleNavDrawer} className="p-1 focus:outline-none">
            <IoMdClose className="h-6 w-6 text-gray-600 hover:text-black" />
          </button>
        </div>

        <div className="p-5 flex-grow overflow-y-auto">
          {user && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
              <p className="font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
            </div>
          )}

          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-base font-medium text-gray-700 hover:text-black py-1"
            >
              Men's Collection
            </Link>

            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-base font-medium text-gray-700 hover:text-black py-1"
            >
              Women's Collection
            </Link>

            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block text-base font-medium text-gray-700 hover:text-black py-1"
            >
              Top Wear
            </Link>

            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block text-base font-medium text-gray-700 hover:text-black py-1"
            >
              Bottom Wear
            </Link>

            <Link
              to="/collections/all"
              onClick={toggleNavDrawer}
              className="block text-base font-medium text-gray-700 hover:text-black py-1"
            >
              All Products
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={toggleNavDrawer}
                className="block text-base font-semibold text-emerald-600 hover:text-emerald-700 py-1"
              >
                Admin Dashboard
              </Link>
            )}

            <div className="pt-4 border-t space-y-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={toggleNavDrawer}
                    className="block text-base font-medium text-gray-700 hover:text-black"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={toggleNavDrawer}
                    className="block text-base font-medium text-gray-700 hover:text-black"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-base font-medium text-red-600 hover:text-red-700 pt-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/login"
                    onClick={toggleNavDrawer}
                    className="block w-full text-center bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleNavDrawer}
                    className="block w-full text-center border border-gray-300 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
