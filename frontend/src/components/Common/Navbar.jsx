import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight, } from "react-icons/hi2"
import SearchBar from './SearchBar.jsx';
import CartDrawer from '../Layout/CartDrawer.jsx';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import logo from "../../assets/logo1.png"

const Navbar = () => {

   const [drawerOpen, setDrawerOpen] = useState(false)
   const [navDrawerOpen, setNavDrawerOpen] = useState(false)

   const toggleNavDrawer = () =>{
    setNavDrawerOpen(!navDrawerOpen)
   }

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left - logo */}
        <div className='flex-shrink-0'>
          <Link to="/" className="block">
            <img src={logo} alt='Logo' className='h-10 w-auto object-contain bg-transparent mix-blend-multiply'/>
          </Link>
        </div>
        {/* Center - Navigation links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>

          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>

          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top wear
          </Link>

          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>

        {/* Right - icons */}
        <div className="flex items-center space-x-4">
          <Link to="/admin" className='block bg-black px-2 rounded text-sm text-white'>Admin</Link>
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 bg-[#ea2e0e] text-white text-xs rounded-full px-2 py-0.5">
              4
            </span>
          </button>

          {/* Search */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile navigation */}
      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        navDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className='flex justify-end p-4'>
          <button onClick={toggleNavDrawer}>
            <IoMdClose className='h-6 w-6 text-gray'/>
          </button>
        </div>
        <div className='p-4'>
          <h2 className='text-xl font-semibold mb-4'>Menu</h2>

          <nav className='space-y-4'>
            <Link to="/collection/all?gender=Men" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
            Men
            </Link>

              <Link to="/collection/all?gender=Women" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
            Women
            </Link>

              <Link to="/collection/all?category=Top Wear" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
            Top Wear
            </Link>
            
              <Link to="/collection/all?category=Bottom Wear" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
            Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar
