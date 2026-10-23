import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice.js";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice.js";
import { fetchUsers } from "../redux/slices/adminSlice.js";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiArrowRight,
} from "react-icons/fi";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, totalSales, totalOrders, loading: ordersLoading } = useSelector(
    (state) => state.adminOrders
  );
  const { products } = useSelector((state) => state.adminProducts);
  const { users } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAdminProducts());
    dispatch(fetchUsers());
  }, [dispatch]);

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time sales, order, and catalog metrics.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/products/new"
            className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition shadow"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Revenue
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">
              ₹{totalSales.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 mt-1 font-semibold">
              From completed orders
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FiDollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Orders
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">
              {totalOrders}
            </p>
            <Link
              to="/admin/orders"
              className="text-xs text-blue-600 hover:underline mt-1 inline-block font-semibold"
            >
              Manage Orders &rarr;
            </Link>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FiShoppingBag className="h-6 w-6" />
          </div>
        </div>

        {/* Products in Catalog */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Products
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">
              {products?.length || 0}
            </p>
            <Link
              to="/admin/products"
              className="text-xs text-blue-600 hover:underline mt-1 inline-block font-semibold"
            >
              Catalog &rarr;
            </Link>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <FiBox className="h-6 w-6" />
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Users
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">
              {users?.length || 0}
            </p>
            <Link
              to="/admin/users"
              className="text-xs text-blue-600 hover:underline mt-1 inline-block font-semibold"
            >
              User List &rarr;
            </Link>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <FiUsers className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Latest transactions placed across the platform
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-gray-700 hover:text-black uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700 border-b">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Fulfillment</th>
                <th className="py-3 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="hover:bg-gray-50/70 transition cursor-pointer"
                  >
                    <td className="py-4 px-6 font-mono text-xs font-bold text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {order.user?.name || "Customer"}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-gray-900">
                      ₹{Number(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-sm">
                    No orders placed yet.
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

export default AdminHomePage;
