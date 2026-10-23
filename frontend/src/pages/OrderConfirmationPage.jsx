import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiTruck, FiArrowRight, FiPrinter } from "react-icons/fi";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/my-orders" replace />;
  }

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt || Date.now());
    orderDate.setDate(orderDate.getDate() + 5);
    return orderDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const orderItems = order.orderItems || order.checkoutItems || [];
  const address = order.shippingAddress || {};
  const details = order.paymentDetails || {};

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
      {/* Success banner */}
      <div className="text-center mb-10 space-y-3">
        <FiCheckCircle className="h-16 w-16 text-emerald-600 mx-auto animate-bounce" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Your order has been placed and confirmed. A confirmation has been logged to your account.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
        {/* Order Reference & Delivery estimate */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b gap-4">
          <div>
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Order Reference
            </p>
            <h2 className="text-xl font-mono font-extrabold text-gray-900">
              #{order._id}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 flex items-center gap-3">
            <FiTruck className="text-emerald-700 h-6 w-6 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Estimated Delivery
              </p>
              <p className="text-sm font-extrabold text-emerald-950">
                {calculateEstimatedDelivery(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Ordered items list */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FiPackage className="text-gray-500" />
            <span>Items Ordered ({orderItems.length})</span>
          </h3>

          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {orderItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover object-top rounded-xl border border-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.color} | {item.size}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    Qty: {item.quantity} &times; ₹{Number(item.price).toLocaleString()}
                  </p>
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

        {/* Payment & Shipping Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Payment Information
            </h4>
            <p className="text-sm font-bold text-gray-900">
              Method: {order.paymentMethod || "Mock Credit Card"}
            </p>
            <p className="text-xs text-gray-600">
              Status:{" "}
              <span
                className={`font-bold uppercase ${
                  order.isPaid ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {order.isPaid ? "Paid & Verified" : "Payment on Delivery"}
              </span>
            </p>
            {details.transactionId && (
              <p className="text-xs font-mono text-gray-500 pt-1">
                Ref: {details.transactionId}
              </p>
            )}
            {details.last4 && (
              <p className="text-xs text-gray-600">
                Card: {details.cardBrand || "Card"} ending in &bull;&bull;&bull;&bull; {details.last4}
              </p>
            )}
            <p className="text-sm font-extrabold text-gray-900 pt-2">
              Total Amount: ₹{Number(order.totalPrice || 0).toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Delivery Address
            </h4>
            <p className="text-sm font-bold text-gray-900">
              {address.address}
            </p>
            <p className="text-xs text-gray-600">
              {address.city}
              {address.state ? `, ${address.state}` : ""}
              {address.zipCode ? ` - ${address.zipCode}` : ""}
            </p>
            <p className="text-xs text-gray-600">{address.country}</p>
            {address.phone && (
              <p className="text-xs text-gray-600 pt-1">Contact: {address.phone}</p>
            )}
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 transition cursor-pointer"
          >
            <FiPrinter className="h-4 w-4" />
            <span>Print Receipt</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              to="/my-orders"
              className="w-full sm:w-auto text-center border border-gray-300 px-6 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
            >
              Track in My Orders
            </Link>
            <Link
              to="/collections/all"
              className="w-full sm:w-auto text-center bg-black text-white px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow"
            >
              <span>Continue Shopping</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
