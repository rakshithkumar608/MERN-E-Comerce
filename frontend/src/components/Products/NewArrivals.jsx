import React, {  useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';


const NewArrivals = () => {

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [CanScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true);

  const NewArrivals = [
    {
      _id: "1",
      name: "Lymio Jackets",
      price:  1749,
      images: [
        {
          url: "https://m.media-amazon.com/images/I/617PqifhwSL._SY879_.jpg",
          altText : "Lymio Jackets",
        }
      ]
    },
      {
      _id: "2",
      name: "Leriya Fashion",
      price: 559,
      images: [
        {
          url: "https://m.media-amazon.com/images/I/71I0GjqQpaL._SY879_.jpg",
          altText : "Leriya Fashion",
        }
      ]
    },
      {
      _id: "3",
      name: "Leriya Fashion",
      price: 509,
      images: [
        {
          url: "https://m.media-amazon.com/images/I/515m-9jJ3zL._SY879_.jpg",
          altText : "Leriya Fashion",
        }
      ]
    },
      {
      _id: "4",
      name: "Leriya Fashion",
      price: 379,
      images: [
        {
          url: "https://m.media-amazon.com/images/I/61sPWGBY5LL._SY741_.jpg",
          altText : "Leriya Fashion",
        }
      ]
    },
      {
      _id: "5",
      name: "AJ DEZINES",
      price: 659,
      images: [
        {
          url: "https://m.media-amazon.com/images/I/617LU5edBML._SY879_.jpg",
          altText : "AJ DEZINES",
        }
      ]
    },
      {
      _id: "6",
      name: "Amazon Brand",
      price: 764,
      images: [
        {
          url: "https://m.media-amazon.com/images/I/61exS1qQAyL._SY879_.jpg",
          altText : "Amazon Brand",
        }
      ]
    },
      {
      _id: "7",
      name: "HELLCAT",
      price: 489,
      images: [
        {
          url: "https://m.media-amazon.com/images/I/614omvuTPtL._SY879_.jpg",
          altText : "HELLCAT",
        }
      ]
    },
      {
      _id: "8",
      name: "BABY JACKSON",
      price: 249,
      images: [
        {
          url: "https://m.media-amazon.com/images/I/710ewaZz4BL._SX679_.jpg",
          altText : "BABY JACKSON",
        },
      ],
    },
  ];

  const handleMouseDown = (e) =>{
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }

  const handleMouseMove = (e) => {
    if(!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
      };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  }
 
  const scroll = (direction) =>{
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    
  }

  //updated scroll Buttons

const updateScrollButtons = () =>{
  const container = scrollRef.current;

  if(container){
    const leftScroll = container.scrollLeft;
    const rightScrollable =
      container.scrollWidth > leftScroll + container.clientWidth;

    setCanScrollLeft(leftScroll > 0);
    setCanScrollRight(rightScrollable);
  }
  // console.log({
  //   scrollLeft: container.scrollLeft,
  //   clientWidth: container.clientWidth,
  //   containerScrollWidth: container.scrollWidth,
  //   offsetLeft: scrollRef.current.offsetLeft,
  // });
  
}


useEffect(() => {
  const container = scrollRef.current;
  if(container){
    container.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();
    return () => container.removeEventListener("scroll", updateScrollButtons)
  }
});


  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest arrivals from our store. Shop now and enjoy the
          best selection of products.
        </p>

        {/* scroll Buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!CanScrollLeft}
            className={`p-2 rounded border ${
              CanScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border ${
              canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* scrollable content */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {NewArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[100%] sm:min-w-[22%] relative"
          >
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-[300px] object-cover rounded-lg"
              draggable="false"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white px-4 rounded-b-lg">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium text-black">{product.name}</h4>
                <p className="mt-1 text-black"> ₹{product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
  
}

export default NewArrivals
