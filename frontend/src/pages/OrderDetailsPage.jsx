import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice.js";
import { FiArrowLeft, FiPackage, FiTruck, FiCreditCard } from "react-icons/fi";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl p-6 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-48 bg-gray-200 rounded-2xl"></div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="container mx-auto max-w-2xl text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "Could not retrieve order details."}</p>
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
        >
          <FiArrowLeft />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  const items = orderDetails.orderItems || [];
  const shipping = orderDetails.shippingAddress || {};

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6 space-y-8">
      {/* Top breadcrumb & heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black mb-2 transition"
          >
            <FiArrowLeft />
            <span>Back to All Orders</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Details
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Placed on {new Date(orderDetails.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              orderDetails.isPaid
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {orderDetails.isPaid ? "Paid" : "Payment Pending"}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              orderDetails.status === "Delivered"
                ? "bg-emerald-100 text-emerald-800"
                : orderDetails.status === "Shipped"
                ? "bg-blue-100 text-blue-800"
                : orderDetails.status === "Cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {orderDetails.status || "Processing"}
          </span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <FiCreditCard className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Payment</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {orderDetails.paymentMethod || "PayPal"}
            </p>
            <p className="text-xs text-gray-500">
              Total Amount: ₹{Number(orderDetails.totalPrice || 0).toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <FiTruck className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Delivery</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {orderDetails.status || "Processing"}
            </p>
            <p className="text-xs text-gray-500">
              {orderDetails.isDelivered
                ? `Delivered on ${new Date(orderDetails.deliveredAt).toLocaleDateString()}`
                : "Estimated: 3-5 business days"}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <FiPackage className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Ship To</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{shipping.address}</p>
            <p className="text-xs text-gray-500">
              {shipping.city}
              {shipping.state ? `, ${shipping.state}` : ""}
              {shipping.zipCode ? ` - ${shipping.zipCode}` : ""}, {shipping.country}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
            Items in this Order ({items.length})
          </h3>

          <div className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover object-top rounded-lg border border-gray-100 flex-shrink-0"
                  />
                  <div>
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-sm font-bold text-gray-900 hover:text-blue-600 transition"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-xs text-gray-600 font-medium mt-1">
                      Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-gray-900">
                    ₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="flex justify-end pt-4 border-t">
          <div className="w-full sm:w-72 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{Number(orderDetails.totalPrice || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="text-emerald-700 font-semibold">FREE</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-extrabold text-base text-gray-900">
              <span>Total Paid</span>
              <span className="text-lg">
                ₹{Number(orderDetails.totalPrice || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
