import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../redux/slices/adminOrderSlice.js";
import { toast } from "sonner";
import { FiTrash2, FiExternalLink, FiClipboard } from "react-icons/fi";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ id: orderId, status: newStatus })
      ).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to update status");
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        toast.success("Order deleted successfully");
      } catch (err) {
        toast.error(typeof err === "string" ? err : "Failed to delete order");
      }
    }
  };

  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Fulfillment Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track customer orders, update delivery status, and review payments
          </p>
        </div>
        <span className="text-xs font-bold bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
          {orders?.length || 0} Total Orders
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700 border-b">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Change Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                        {order.user?.name || "Customer"}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {order.user?.email || order.shippingAddress?.city}
                      </p>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-gray-700">
                      {order.orderItems?.length || 0} item(s)
                    </td>

                    <td className="py-4 px-4 font-extrabold text-xs text-gray-900">
                      ₹{Number(order.totalPrice || 0).toLocaleString()}
                    </td>

                    <td className="py-4 px-4">
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

                    <td className="py-4 px-4">
                      <select
                        value={order.status || "Processing"}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : order.status === "Shipped"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : order.status === "Cancelled"
                            ? "bg-red-50 text-red-800 border-red-300"
                            : "bg-yellow-50 text-yellow-800 border-yellow-300"
                        }`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/order/${order._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Order Details"
                        >
                          <FiExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Order"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <FiClipboard className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-semibold">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
