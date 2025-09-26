import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate()

  useEffect(()=>{
    //simulating fetching orders
    setTimeout(()=>{
      const mockOrders = [
        {
          _id: "126",
          createdAt: new Date(),
          shippingAddress: { city: "Bangaluru", country: "India" },
          orderItems: [
            {
              name: "Product 1",
              Image: "https://m.media-amazon.com/images/I/61f8ZKHW-IL._SY879_.jpg",
            },
          ],
          totalPrice: 499,
          user: { name: "Ajay", email: "Ajay@example.com" },
          isPaid: true,
        },

        {
          _id: "345",
          createdAt: new Date(),
          shippingAddress: { city: "Devanahalli", country: "India" },
          orderItems: [
            {
              name: "Product 2",
              Image: "https://m.media-amazon.com/images/I/61jnGK31I7L._AC_UL480_FMwebp_QL65_.jpg",
            },
          ],
          totalPrice: 679,
          user: { name: "Ranjith", email: "Ranjith@example.com" },
          isPaid: false,
        },

        {
          _id: "878",
          createdAt: new Date(),
          shippingAddress: { city: "Kolar", country: "India" },
          orderItems: [
            {
              name: "Product 3",
              Image: "https://m.media-amazon.com/images/I/6182bkTGrqL._SX679_.jpg",
            },
          ],
          totalPrice: 840,
          user: { name: "Ratish", email: "Ratish@example.com" },
          isPaid: true,
        },

         {
          _id: "476",
          createdAt: new Date(),
          shippingAddress: { city: "Hoskote", country: "India" },
          orderItems: [
            {
              name: "Product 4",
              Image: "https://m.media-amazon.com/images/I/41HT3bWf6yL._SY741_.jpg",
            },
          ],
          totalPrice: 750,
          user: { name: "Bharath", email: "Bharath@example.com" },
          isPaid: false,
        },
      ];

      setOrders(mockOrders);
    }, 1000);
  }, [])

  const handleRowClick = (orderId) =>{
    navigate(`/order/${orderId}`);
  }

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
       <h2 className='text-xl sm:text-2xl font-bold mb-6'>My Orders</h2>
       <div className='relative shadoe-md sm:rounded-lg overflow-hidden'>
       <table className='min-w-full text-left text-gray-500'>
         <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
          <tr>
        <th className='py-2 px-4 sm:py-3'>Image</th>
        <th className='py-2 px-4 sm:py-3'>Order ID</th> 
        <th className='py-2 px-4 sm:py-3'>Created</th> 
        <th className='py-2 px-4 sm:py-3'>Shipping Address</th> 
        <th className='py-2 px-4 sm:py-3'>Items</th> 
        <th className='py-2 px-4 sm:py-3'>Price</th> 
        <th className='py-2 px-4 sm:py-3'>User</th>
        <th className='py-2 px-4 sm:py-3'>Status</th>  
          </tr>
         </thead>
         <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr 
              key={order._id} 
              onClick={() => handleRowClick(order._id)}
              className='cursor-pointer border-b hover:border-gray-50'>
                <td className='py-2 px-2 sm:py-3 sm:px-4'>
                  <img src={order.orderItems[0].Image} alt={order.orderItems[0].name} className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg' />
                </td>
               <td className='py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap'>#{order._id}</td>
              

               <td className='py-2 px-2 sm:py-4 sm:px-4'>
                {new Date(order.createdAt).toLocaleDateString()}{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
               </td>

               <td className='py-2 px-2 sm:py-4 sm:px-4'>
                {order.shippingAddress
                ? `${order.shippingAddress.city}, 
                ${order.shippingAddress.country}`
              : "N/A"}
               </td>

               <td className='py-2 px-2 sm:py-4 sm:px-4  text-center'>{order.orderItems.length}</td>
              
               <td className='py-2 px-2 sm:py-4 sm:px-4  text-center'>{order.totalPrice}</td>

               <td className='py-2 px-2 sm:py-4 sm:px-4'>
                {order.user
                ? `${order.user.name}, 
                ${order.user.email}`
              : "N/A"}
               </td>


               <td className='py-2 px-2 sm:py-4 sm:px-4  text-center'>
                <span 
                className={`${
                  order.isPaid
                  ? "bg-green-100 text-green-700"
                  :"bg-red-100 text-red-700 "
                } px-2 py-1 rounded-full sm:text-sm font-medium`} >
                    {order.isPaid ? "Paid" : "Pending"}
                
                </span>
               </td>

                </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className='py-4 px-4 text-center text-gray-500'>
                You have no orders
              </td>
            </tr>
          )}
         </tbody>
       </table>
       </div>
    </div>
  )
}

export default MyOrdersPage