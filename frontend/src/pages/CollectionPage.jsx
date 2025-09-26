import React, { useEffect, useRef, useState } from 'react'
import {FaFilter} from "react-icons/fa"
import FilterSidebar from '../components/Products/FilterSidebar.jsx';
import SortOptions from '../components/Products/SortOptions.jsx';
import ProductGrid from '../components/Products/ProductGrid.jsx';

const CollectionPage = () => {

  const [products, setProducts] = useState([]);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () =>{
    setIsSidebarOpen(!isSidebarOpen);
  };


  const handleClickOutside = (e) =>{
    //close sidebar if clicked outside
   if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  }

  useEffect(()=>{
    //Add Event listener for clicks
    document.addEventListener("mousedown", handleClickOutside)
    //clean event listner
    return () =>{
    document.removeEventListener("mousedown", handleClickOutside)
    }
  },[isSidebarOpen]);

  useEffect(() => {
    setTimeout(()=>{
      const fetchedProducts = [
  {
    _id: 1,
    name: " Men's Formal Button Down Shirt",
    price: 499,
    images: [{url:"https://m.media-amazon.com/images/I/61WaRRjyj0L._SY741_.jpg"}]
  },
   {
    _id: 2,
    name: " PROSHARX 2 in 1 Active Dual Shorts ",
    price: 442,
    images: [{url:"https://m.media-amazon.com/images/I/51WHQvSNLFL._SX679_.jpg"}]
  },
   {
    _id: 3,
    name: " Men's Full Sleeve Shirt",
    price: 699,
    images: [{url:"https://m.media-amazon.com/images/I/51d6niHtecL._SY879_.jpg"}]
  },
   {
    _id: 4,
    name: "CB-COLEBROOK Men's Casual",
    price: 499,
    images: [{url:"https://m.media-amazon.com/images/I/51RgKA1pC1L.jpg"}]
  },
   {
    _id: 5,
    name: "SUPRABHATAM Men's Trouser",
    price: 726,
    images: [{url:"https://m.media-amazon.com/images/I/611S0-4lmPL._SY879_.jpg"}]
  },
     {
    _id: 6,
    name: " Funkyrich® Shirts for Men",
    price: 399,
    images: [{url:"https://m.media-amazon.com/images/I/716-U8Ni5xL._SX679_.jpg"}]
  },
     {
    _id: 7,
    name: "KOTTY Regular Mens Jeans",
    price: 589,
    images: [{url:"https://m.media-amazon.com/images/I/81x8Ep5VdGL._SY741_.jpg"}]
  },

     {
    _id: 8,
    name: "FILO HEVIS Men's Casual Shirt.",
    price: 499,
    images: [{url:"https://m.media-amazon.com/images/I/61XuuE2RvfL._SX679_.jpg"}]
  },

   {
    _id: 9,
    name: "TAGAS Men's Regular Jeans",
    price: 799,
    images: [{url:"https://m.media-amazon.com/images/I/61dtQkm4HsL._SY879_.jpg"}]
  },

  {
    _id: 10,
    name: "XYXX Men's Fit Polo T-Shirt",
    price: 589,
    images: [{url:"https://m.media-amazon.com/images/I/61w2PG6QNqL._SY879_.jpg"}]
  },


  {
    _id: 11,
    name: "LEOTUDE Oversized Thirt for Man",
    price: 299,
    images: [{url:"https://m.media-amazon.com/images/I/61WYx598KKL._SY741_.jpg"}]
  },

  {
    _id: 12,
    name: "Ben Martin Men Jeans",
    price: 899,
    images: [{url:"https://m.media-amazon.com/images/I/61vM-d6ijBL._SY741_.jpg"}]
  },

  {
    _id: 13,
    name: "Printed Black Oversized T-Shirt",
    price: 349,
    images: [{url:"https://m.media-amazon.com/images/I/71VcJu43KIL._SX679_.jpg"}]
  },

  {
    _id: 14,
    name: "LEOTUDE Men's Oversized T-shirt",
    price: 285,
    images: [{url:"https://m.media-amazon.com/images/I/61lSkrx-vtL._SY879_.jpg"}]
  },


  {
    _id: 15,
    name: "MALENO Men's Casual ",
    price: 499,
    images: [{url:"https://m.media-amazon.com/images/I/71PsC9BiwnL._SY879_.jpg"}]
  },

  {
    _id: 16,
    name: "NexaFlair Casual Shirt for Men",
    price: 499,
    images: [{url:"https://m.media-amazon.com/images/I/71wFYOb2NNL._SX679_.jpg"}]
  },

];
setProducts(fetchedProducts);
    }, 1000)
  }, []);


  return (
    <div className='flex flex-col lg:flex-row'>
      {/* Mobile Filter button */}
      <button 
      onClick={toggleSidebar} 
      className='lg:hidden border p-2 flex justify-center items-ccenter '>
        <FaFilter className='mr-2 items-center justify-center'/>
        
      </button>

        {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Filter Section */}
      <div 
      ref={sidebarRef} 
      className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0  w-50 bg-white border overflow-y-auto transition-transform duration-300 lg:translate-x-0 lg:static lg:transform-none ${!isSidebarOpen ? 'lg:-translate-x-full lg:fixed' : ''}`}>
        <FilterSidebar />
      </div>

      <div className='flex-grow px-4'>
        <h2 className='text-2xl uppercase mb-4'>All Collection</h2>

        {/* sort options */}
        <SortOptions />


        {/* products grid */}
        <ProductGrid products={products}/>
      </div>
    </div>
  )
}

export default CollectionPage