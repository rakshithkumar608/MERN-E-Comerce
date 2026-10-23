import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  createCheckout,
  payCheckout,
  finalizeCheckout,
} from "../../redux/slices/checkoutSlice.js";
import { clearCart } from "../../redux/slices/cartSlice.js";
import PayPalButton from "./PayPalButton.jsx";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { checkout, loading: checkoutLoading } = useSelector(
    (state) => state.checkout
  );

  const cartProducts = cart?.products || [];
  const totalPrice = cartProducts.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [activeCheckoutId, setActiveCheckoutId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.name ? user.name.split(" ")[0] : "",
    lastName: user?.name ? user.name.split(" ").slice(1).join(" ") : "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
  });

  useEffect(() => {
    if (!cartProducts || cartProducts.length === 0) {
      toast.info("Your cart is empty. Please add items before checking out.");
      navigate("/collections/all");
    }
  }, [cartProducts, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ["firstName", "address", "city", "country", "phone"];
    for (const field of required) {
      if (!shippingAddress[field] || !shippingAddress[field].trim()) {
        toast.error(`Please provide your ${field}`);
        return false;
      }
    }
    return true;
  };

  // Place order for Cash on Delivery or Card demo
  const handlePlaceOrderDirect = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const checkoutItems = cartProducts.map((p) => ({
        productId: p.productId?._id || p.productId,
        name: p.name,
        image: p.image,
        price: p.price,
        size: p.size,
        color: p.color,
        quantity: p.quantity,
      }));

      // 1. Create checkout
      const checkoutRes = await dispatch(
        createCheckout({
          checkoutItems,
          shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            zipCode: shippingAddress.zipCode,
            postalCode: shippingAddress.zipCode,
            state: shippingAddress.state,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          },
          paymentMethod,
          totalPrice,
        })
      ).unwrap();

      // 2. Finalize checkout into real Order
      const finalizedOrder = await dispatch(
        finalizeCheckout(checkoutRes._id)
      ).unwrap();

      // 3. Clear cart
      dispatch(clearCart());

      toast.success("Order placed successfully!");
      navigate("/order-confirmation", {
        state: { order: finalizedOrder },
      });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  // Pre-create checkout session for PayPal payment
  const handleInitPayPal = async () => {
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const checkoutItems = cartProducts.map((p) => ({
        productId: p.productId?._id || p.productId,
        name: p.name,
        image: p.image,
        price: p.price,
        size: p.size,
        color: p.color,
        quantity: p.quantity,
      }));

      const res = await dispatch(
        createCheckout({
          checkoutItems,
          shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country,
          },
          paymentMethod: "PayPal",
          totalPrice,
        })
      ).unwrap();

      setActiveCheckoutId(res._id);
      toast.success("Checkout ready. You can now complete PayPal payment.");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to initialize PayPal");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayPalSuccess = async (details) => {
    if (!activeCheckoutId) return;
    try {
      setSubmitting(true);
      await dispatch(
        payCheckout({
          id: activeCheckoutId,
          paymentDetails: details,
        })
      ).unwrap();

      const finalizedOrder = await dispatch(
        finalizeCheckout(activeCheckoutId)
      ).unwrap();

      dispatch(clearCart());
      toast.success("Payment confirmed! Your order is placed.");
      navigate("/order-confirmation", {
        state: { order: finalizedOrder },
      });
    } catch (err) {
      toast.error("Payment was successful but finalizing order failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-6xl">
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-gray-900 mb-8 pb-4 border-b">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider pb-2 border-b">
              1. Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={shippingAddress.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={shippingAddress.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="House number, apartment, street name"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider pb-2 border-b">
              2. Payment Method
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                  paymentMethod === "Cash on Delivery"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-black"
                  />
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">
                      Cash on Delivery (COD) / Direct Pay
                    </span>
                    <span className="text-xs text-gray-500">
                      Pay upon delivery or fast test confirmation
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  Instant
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                  paymentMethod === "PayPal"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-black"
                  />
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">
                      PayPal / Credit or Debit Card
                    </span>
                    <span className="text-xs text-gray-500">
                      Secure payment via PayPal Sandbox
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                  Online
                </span>
              </label>
            </div>

            {/* Action buttons depending on payment method */}
            <div className="pt-4">
              {paymentMethod === "Cash on Delivery" ? (
                <button
                  type="button"
                  onClick={handlePlaceOrderDirect}
                  disabled={submitting || checkoutLoading}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800 active:scale-[0.99] transition shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Placing Order..." : `Place Order (₹${totalPrice.toLocaleString()})`}
                </button>
              ) : (
                <div className="space-y-4">
                  {!activeCheckoutId ? (
                    <button
                      type="button"
                      onClick={handleInitPayPal}
                      disabled={submitting}
                      className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-blue-700 transition cursor-pointer shadow"
                    >
                      {submitting ? "Preparing..." : "Continue to PayPal"}
                    </button>
                  ) : (
                    <div className="p-4 bg-gray-50 border rounded-xl">
                      <p className="text-xs text-gray-600 mb-3 text-center font-medium">
                        Complete your payment using PayPal below:
                      </p>
                      <PayPalButton
                        amount={Math.round(totalPrice / 85) || 1}
                        onSuccess={handlePayPalSuccess}
                        onError={(err) => toast.error("PayPal transaction failed")}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Summary: Order Items & Pricing */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs sticky top-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider pb-2 border-b">
              Order Summary ({cartProducts.length} items)
            </h2>

            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
              {cartProducts.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 object-cover object-top rounded-lg border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {item.size} | {item.color}
                    </p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    ₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-700 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-baseline text-base font-extrabold text-gray-900">
                <span>Total Amount</span>
                <span className="text-xl">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
