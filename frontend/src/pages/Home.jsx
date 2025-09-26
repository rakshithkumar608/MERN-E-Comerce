import React from 'react'
import Hero from '../components/Layout/Hero.jsx'
import GenderCollectionSection from '../components/Products/GenderCollectionSection.jsx'
import NewArrivals from '../components/Products/NewArrivals.jsx'
import ProductDetails from '../components/Products/ProductDetails.jsx'
import ProductGrid from '../components/Products/ProductGrid.jsx'
import FeaturedCollection from '../components/Products/FeaturedCollection.jsx'
import FeaturesSection from '../components/Products/FeaturesSection.jsx'



const placeholderProducts = [
  {
    _id: 1,
    name: "Women's Oversized  Casual Cotton Shirt",
    price: 1149,
    images: [{url:"https://m.media-amazon.com/images/I/812AodWhRmL._SX569_.jpg"}]
  },
   {
    _id: 2,
    name: " Oversized Shirt for Women ",
    price: 479,
    images: [{url:"https://m.media-amazon.com/images/I/61Su7JLpk0L._SY879_.jpg"}]
  },
   {
    _id: 3,
    name: "rytras Cotton Regular Fit Top",
    price: 499,
    images: [{url:"https://m.media-amazon.com/images/I/713wEcCIKRL._SY879_.jpg"}]
  },
   {
    _id: 4,
    name: "GRECIILOOKS Shirt for Women Stylish",
    price: 479,
    images: [{url:"https://m.media-amazon.com/images/I/71f3SP2zNKL._SY879_.jpg"}]
  },
   {
    _id: 5,
    name: "HIGH STAR Oversized Fit Shirt",
    price: 690,
    images: [{url:"https://m.media-amazon.com/images/I/61GH9f2HQAL._SY741_.jpg"}]
  },
     {
    _id: 6,
    name: "DEIDAD Women's Regular Fit Top",
    price: 299,
    images: [{url:"https://m.media-amazon.com/images/I/71DOkPEFUML._SY879_.jpg"}]
  },
     {
    _id: 7,
    name: "Knit Shirts Tops for Women",
    price: 349,
    images: [{url:"https://m.media-amazon.com/images/I/71wz3uReS2L._SY879_.jpg"}]
  },

     {
    _id: 8,
    name: "GRECIILOOKS Co Ord Set for Women",
    price: 650,
    images: [{url:"https://m.media-amazon.com/images/I/41qGWj4zZ1L.jpg"}]
  },
]



const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />


      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
      <ProductDetails />



      <div className='container mx-auto'>
        <h2 className='text-3xl text-center font-bold mb-4'>Top Wears for Women</h2>
        <ProductGrid products={placeholderProducts}/>
      </div>

      <FeaturedCollection />
      <FeaturesSection />
    </div>
  )
}

export default Home
