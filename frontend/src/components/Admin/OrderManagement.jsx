import React from "react";

const OrderManagement = () => {
  const orders = [
    {
      _id: 123123,
      user: {
        name: "Rakesh",
      },
      totalPrice: 110,
      status: "Delivered",
    },

    {
      _id: 125677,
      user: {
        name: "Raj",
      },
      totalPrice: 410,
      status: "Processing",
    },

    {
      _id: 1237898,
      user: {
        name: "Jay",
      },
      totalPrice: 210,
      status: "Cancelled",
    },

    {
      _id: 345667,
      user: {
        name: "Abhi",
      },
      totalPrice: 110,
      status: "Shipped",
    },
  ];

  const handleStatusChange = (orderId, status) => {
    console.log({ id: orderId, status: status });
  };

  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>

                  <td className="p-4">{order.user.name}</td>
                  <td className="p-4">${order.totalPrice}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 flex gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order._id, status)}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          status === "Processing"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : status === "Shipped"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : status === "Delivered"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
