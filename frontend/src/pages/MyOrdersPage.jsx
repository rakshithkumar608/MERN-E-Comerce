import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/slices/orderSlice.js";
import { FiPackage, FiArrowRight } from "react-icons/fi";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading && (!orders || orders.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track and manage your order history
          </p>
        </div>
        <Link
          to="/collections/all"
          className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
        >
          Shop More Products &rarr;
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {orders && orders.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700 border-b">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const firstItem = order.orderItems?.[0];
                  const itemCount = order.orderItems?.length || 0;

                  return (
                    <tr
                      key={order._id}
                      onClick={() => handleRowClick(order._id)}
                      className="hover:bg-gray-50/70 transition cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={firstItem?.image || "https://picsum.photos/100?random=1"}
                            alt={firstItem?.name || "Order item"}
                            className="w-12 h-14 object-cover object-top rounded-lg border border-gray-100 flex-shrink-0"
                          />
                          <div className="max-w-[140px]">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {firstItem?.name || "Order"}
                            </p>
                            {itemCount > 1 && (
                              <p className="text-[11px] text-gray-400">
                                +{itemCount - 1} more item{itemCount - 1 > 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs font-semibold text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-xs text-gray-700">
                        {order.shippingAddress?.city}, {order.shippingAddress?.country}
                      </td>

                      <td className="py-3 px-4 font-extrabold text-xs text-gray-900 whitespace-nowrap">
                        ₹{Number(order.totalPrice || 0).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            order.isPaid
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status || "Processing"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button className="text-gray-400 hover:text-black p-1">
                          <FiArrowRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
          <FiPackage className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't placed any orders with us yet. Start browsing our latest collections!
          </p>
          <Link
            to="/collections/all"
            className="inline-block bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
