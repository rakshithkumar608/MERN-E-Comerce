import React from 'react'

const Checkout = {
  _id: "12323",
  createdAt: new Date(),
  checkoutItems: [
     {
      productId: 1,
      name: "Jacket",
      size: "M",
      color: "Brown",
      price: 300,
      quantity: 1,
      image: "https://picsum.photos/500/500?random=1",
    },
    {
      productId: 2,
      name: "Jeans",
      size: "L",
      color: "Blue",
      price: 599,
      quantity: 2,
      image: "https://picsum.photos/500/500?random=2",
    },
  ],
  shippingAddress: {
    address: "Bangalore Tin factory",
    city: "Hoskote",
    countery:"India"
  },
};

const OrderConfirmationPage = () => {

  const calculateEstimatedDelivary = (createdAt) =>{
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10)
    return orderDate.toLocaleDateString()
  }
  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
      <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>Thank You for Your Order!</h1>

      {Checkout && <div className='p-6 rounded-lg border'>
        <div className='flex justify-between mb-20'>

          {/* Order id and date */}
          <div>
            <h2 className='text-xl font-semibold'>Order ID: {Checkout._id}</h2>
            <p className='text-gray-500'>
              Order date: {new Date(Checkout.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* estimated delivary */}
          <div>
            <p className='text-emerald-700 text-sm'>
              Estimated Delivary:{" "}
              {calculateEstimatedDelivary(Checkout.createdAt)}
            </p>
          </div>
        </div>

        {/* orderd items */}
        <div className='mb-20'>
          {Checkout.checkoutItems.map((item)=>(
            <div 
            key={item.productId}
            className='flex items-center mb-4'>
            <img 
            src={item.image} 
            alt={item.name}
            className='w-16 h-16 object-cover rounded-md mr-4'
            />
            <div>
              <h4 className='text-md font-semibold'>{item.name}</h4>
              <p className='text-sm text-gray-500'>
                {item.color} | {item.size}
              </p>
            </div>
            <div className='ml-auto text-right'>
              <p className='text-md'>${item.price}</p>
              <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
            </div>
            </div>
          ))}
        </div>
        {/* payment and delivary info */}
        <div className='grid grid-cols-2 gap-8'>
          {/* payment info */}
          <div>
            <h4 className='text-lg font-semibold mb-2'>Payment</h4>
            <p className='text-gray-600'>PayPal</p>
          </div>

          {/* delivary info */}
          <div>
             <h4 className='text-lg font-semibold mb-2'>Delivary</h4>
            <p className='text-gray-600'>{Checkout.shippingAddress.address}</p>
            <p className='text-gray-600'>
              {Checkout.shippingAddress.city},{" "}
              {Checkout.shippingAddress.countery}
              </p>
          </div>
        </div>
      </div>

      }
    </div>
  )
}

export default OrderConfirmationPage