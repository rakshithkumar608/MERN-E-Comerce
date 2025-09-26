import React, { useEffect, useState, } from 'react'
import { toast } from "sonner"
import ProductGrid from './ProductGrid.jsx';

const selectedProduct = {
  name: "Casual Shirt",
   price: 499,
  originalPrice: 999,
  description: "IndoPrimo Men's Stylish Solid Satin Casual Shirt for Men Full Sleeve",
  brand: "IndoPrimo",
  material: "Soft Satin",
  sizes: ["S", "M", "L", "XL"],
  colors: [ "Black", "Maroon","Green","Yellow","Rama"],
  discount: "off:-50%",
  images: [{
    url: "https://m.media-amazon.com/images/I/61WNCrKRycL._SX569_.jpg",
    altText: "Casual Shirt 1",
    
  },
  {
    url: "https://m.media-amazon.com/images/I/61EPqGHG9kL._SX569_.jpg",
    altText: "Casual Shirt 2",
    
  },
  {
    url: "https://m.media-amazon.com/images/I/61DsYHiX-8L._SX569_.jpg",
    altText: "Casual Shirt 3",
     
  },
  {
    url: "https://m.media-amazon.com/images/I/61QVTj718aL._SX569_.jpg",
    altText: "Casual Shirt 4",
  },
  {
    url: "https://m.media-amazon.com/images/I/61ma1qHO7cL._SX569_.jpg",
    altText: "Casual Shirt 5",
  },
  ],
};

const similarProducts = [
  {
    _id: 1,
    name: "Lymio Men's Solid Regular Fit Shirt",
    price: 799,
    images: [{url:"https://m.media-amazon.com/images/I/818y8O-XoUL._SX679_.jpg"}]
  },
   {
    _id: 2,
    name: "GRECIILOOKS",
    price: 499,
    images: [{url:"https://m.media-amazon.com/images/I/71QrkXBPABL._SY879_.jpg"}]
  },
   {
    _id: 3,
    name: "Peter England Men's  T-Shirt",
    price: 619,
    images: [{url:"https://m.media-amazon.com/images/I/615SEHDHtTL._SY879_.jpg"}]
  },
   {
    _id: 4,
    name: "The Indian Garage",
    price: 618,
    images: [{url:"https://m.media-amazon.com/images/I/51kNyChl7+L._SX679_.jpg"}]
  },
   {
    _id: 5,
    name: "KOTTY Mens Regular Fit",
    price: 500,
    images: [{url:"https://m.media-amazon.com/images/I/61dFcpPdJkL._SY879_.jpg"}]
  },
     {
    _id: 6,
    name: "Lymio Men High Rise Joggers",
    price: 599,
    images: [{url:"https://m.media-amazon.com/images/I/51B83G4aZFL._SY879_.jpg"}]
  },
     {
    _id: 7,
    name: "Solid Super Loose Fit Jogger",
    price: 949,
    images: [{url:"https://m.media-amazon.com/images/I/61rulnuDn0L._SY879_.jpg"}]
  },

     {
    _id: 8,
    name: "Hubberholme",
    price: 1280,
    images: [{url:"https://m.media-amazon.com/images/I/61BUFYiplzL._SX679_.jpg"}]
  },


]

const ProductDetails = () => {

const [mainImage, setMainImage] = useState("");
const [selectedSize, setSelectedSize] = useState("");
const [selectedColor, setSelectedColor] = useState("");
const [quantity, setQuantity] = useState(1);
const [isButtonDisabled, setIsButtonDisabled] = useState(false)



useEffect(() => {
  if(selectedProduct?.images?.length > 0){
    setMainImage(selectedProduct.images[0].url);
  }
}, []);

const handleQuantityChange = (action) => {
  if(action === "plus") setQuantity((prev) => prev + 1);
  if(action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
   }


const handleAddToCart = () =>{
  if (!selectedSize || !selectedColor) {
 toast.error("Please select a size and color before adding to cart.",{
  duration: 1000,
 });
  return;
}

setIsButtonDisabled(true)

setTimeout(()=>{
  toast.success("Product added to cart successfully.",{
  duration: 1000,
})
setIsButtonDisabled(false);
}, 500);
    
  };


  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* left thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-15  h-15 object-cover rounded-lg cursor-pointer border shadow-md ${
                  mainImage === image.url
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>
          {/* main image */}
          <div className="md:w-1/3">
            <div className="mb-4">
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Mobile Thumbnails */}
          <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border shadow-md ${
                  mainImage === image.url
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Right side */}
          <div className="md:w-1/3 md:ml-10">
            <h1 className="text-2xl font-bold mb-2">{selectedProduct.name}</h1>
            <p className="text-lg text-gray-600 mb-1 line-through">
              {selectedProduct.originalPrice &&
                `₹${selectedProduct.originalPrice}`}
            </p>
            <p className="text-lg text-gray-600 mb-2">
              {selectedProduct.discount}
            </p>
            <p className="text-xl text-gray-500 mb-2">
              ₹ {selectedProduct.price}
            </p>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

            <div className="mb-4">
              <p className="text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                     
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color ? "border-black" : "bg-gray-300 "
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                    }}

                  ></button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded borded  ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-gray-300 "
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                isButtonDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-900"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "ADD TO CART"}
            </button>

            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
              <table className="w-full text-left text-sm text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-1">Brand</td>
                    <td className="py-1">{selectedProduct.brand}</td>
                  </tr>

                  <tr>
                    <td className="py-1">Material</td>
                    <td className="py-1">{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">
            You May Also Like
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails