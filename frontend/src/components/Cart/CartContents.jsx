import React from 'react'
import { RiDeleteBin3Line } from 'react-icons/ri';

const CartContents = () => {

  const cartProducts = [
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color : "Red",
      quantity : 1,
      price: 300,
      image: "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/g/d/z/xl-shopy-rn1-red-nrd-fashion-original-imahe4cau654tfhr.jpeg?q=70",
    },

    {
      productId: 2,
      name: "Jeans",
      size: "L",
      color : "Blue",
      quantity : 1,
      price: 599,
      image: "https://rukminim2.flixcart.com/image/612/612/xif0q/jean/u/9/r/32-kottymensjeans171-kotty-original-imah7hkra7gua5ey.jpeg?q=70",
    },
  ];
  return (
    <div>
      {cartProducts.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />

            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-gray-500">
                size:{product.size}  color:{product.color}
              </p>
              <div className="flex items-center mt-2">
                <button className="border rounded px-2 py-1 text-xl font-medium">
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button className="border rounded px-2 py-1 text-xl font-medium">
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>₹ {product.price.toLocaleString()}</p>
            <button>
              <RiDeleteBin3Line className='h-6 w-6 mt-2 text-red-600'/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartContents
