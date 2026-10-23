import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiTruck, FiArrowRight } from "react-icons/fi";

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

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
      {/* Success banner */}
      <div className="text-center mb-10 space-y-3">
        <FiCheckCircle className="h-16 w-16 text-emerald-600 mx-auto animate-bounce" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Your order has been received and is being processed. A confirmation has been logged to your account.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
        {/* Order ID & Estimated Delivery */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b gap-4">
          <div>
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Order Reference
            </p>
            <h2 className="text-xl font-extrabold text-gray-900">#{order._id}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <FiTruck className="text-emerald-700 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Estimated Delivery
              </p>
              <p className="text-sm font-bold text-emerald-900">
                {calculateEstimatedDelivery(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Ordered items list */}
        <div>
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FiPackage className="text-gray-500" />
            <span>Items Ordered ({orderItems.length})</span>
          </h3>

          <div className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
            {orderItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover object-top rounded-lg border border-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.color} | {item.size}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Shipping Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Payment Information
            </h4>
            <p className="text-sm font-semibold text-gray-900">
              Method: {order.paymentMethod || "PayPal"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Status:{" "}
              <span
                className={`font-bold ${
                  order.isPaid ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {order.isPaid ? "Paid" : "Pending / Cash on Delivery"}
              </span>
            </p>
            <p className="text-sm font-extrabold text-gray-900 mt-3">
              Total Paid: ₹{Number(order.totalPrice || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Shipping Destination
            </h4>
            <p className="text-sm font-semibold text-gray-900">
              {address.address}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {address.city}
              {address.state ? `, ${address.state}` : ""}
              {address.zipCode ? ` - ${address.zipCode}` : ""}
            </p>
            <p className="text-xs text-gray-600">{address.country}</p>
            {address.phone && (
              <p className="text-xs text-gray-600 mt-1">Phone: {address.phone}</p>
            )}
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <Link
            to="/my-orders"
            className="w-full sm:w-auto text-center border border-gray-300 px-6 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
          >
            View My Orders
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
  );
};

export default OrderConfirmationPage;
