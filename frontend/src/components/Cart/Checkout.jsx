import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  createDirectOrder,
  createCheckout,
  payCheckout,
  finalizeCheckout,
} from "../../redux/slices/checkoutSlice.js";
import { clearCart } from "../../redux/slices/cartSlice.js";
import PayPalButton from "./PayPalButton.jsx";
import MockPaymentModal from "./MockPaymentModal.jsx";
import {
  FiCreditCard,
  FiTruck,
  FiCheck,
  FiTag,
  FiShield,
  FiSmartphone,
  FiDollarSign,
  FiAlertCircle,
} from "react-icons/fi";
import { FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";
import { SiGooglepay, SiPaytm, SiPhonepe } from "react-icons/si";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading: checkoutLoading } = useSelector((state) => state.checkout);

  const cartProducts = cart?.products || [];

  // Price calculations
  const rawSubtotal = cartProducts.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  // States
  const [shippingMethod, setShippingMethod] = useState("standard"); // standard: 0, express: 99
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("card_mock"); // 'card_mock', 'upi_mock', 'paypal', 'cod'
  const [submitting, setSubmitting] = useState(false);
  const [showMockModal, setShowMockModal] = useState(false);
  const [pendingPaymentDetails, setPendingPaymentDetails] = useState(null);

  // Card form state
  const [cardData, setCardData] = useState({
    cardNumber: "4532 8888 9999 1234",
    cardHolder: user?.name || "John Doe",
    expiry: "12/28",
    cvv: "888",
  });

  // UPI state
  const [upiId, setUpiId] = useState("shopper@okhdfcbank");

  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.name ? user.name.split(" ")[0] : "",
    lastName: user?.name ? user.name.split(" ").slice(1).join(" ") : "",
    address: "742 Evergreen Terrace",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560001",
    country: "India",
    phone: "+91 98765 43210",
  });

  // Shipping cost
  const shippingCost = shippingMethod === "express" ? 99 : 0;
  // Grand total
  const grandTotal = Math.max(0, rawSubtotal - couponDiscount + shippingCost);

  useEffect(() => {
    if (!cartProducts || cartProducts.length === 0) {
      toast.info("Your cart is empty. Please add items to checkout.");
      navigate("/collections/all");
    }
  }, [cartProducts, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      // Format as 16 digits with spaces
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
      setCardData((prev) => ({ ...prev, cardNumber: formatted }));
    } else if (name === "expiry") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      const formatted = cleaned.length >= 3 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
      setCardData((prev) => ({ ...prev, expiry: formatted }));
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setCardData((prev) => ({ ...prev, cvv: cleaned }));
    } else {
      setCardData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFillDemoCard = () => {
    setCardData({
      cardNumber: "4532 8888 9999 1234",
      cardHolder: user?.name || "Demo Shopper",
      expiry: "12/28",
      cvv: "777",
    });
    toast.success("Demo Visa card filled!");
  };

  // Coupon handling
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    if (code === "MARTIFY10") {
      const discount = Math.round(rawSubtotal * 0.1);
      setCouponDiscount(discount);
      setAppliedCoupon({ code, discount, label: "10% Discount Applied" });
      toast.success("Coupon 'MARTIFY10' applied! Saved 10%");
      setCouponCode("");
    } else if (code === "WELCOME50") {
      const discount = Math.min(50, rawSubtotal);
      setCouponDiscount(discount);
      setAppliedCoupon({ code, discount, label: "₹50 Off Applied" });
      toast.success("Coupon 'WELCOME50' applied! Saved ₹50");
      setCouponCode("");
    } else if (code === "SAVE100") {
      if (rawSubtotal < 500) {
        toast.error("'SAVE100' requires a minimum order of ₹500");
        return;
      }
      const discount = 100;
      setCouponDiscount(discount);
      setAppliedCoupon({ code, discount, label: "₹100 Off Applied" });
      toast.success("Coupon 'SAVE100' applied! Saved ₹100");
      setCouponCode("");
    } else {
      toast.error("Invalid coupon code. Try 'MARTIFY10' or 'WELCOME50'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    toast.info("Coupon removed");
  };

  const validateAddress = () => {
    if (!shippingAddress.firstName.trim()) {
      toast.error("Please enter first name");
      return false;
    }
    if (!shippingAddress.address.trim()) {
      toast.error("Please enter street address");
      return false;
    }
    if (!shippingAddress.city.trim()) {
      toast.error("Please enter city");
      return false;
    }
    if (!shippingAddress.phone.trim()) {
      toast.error("Please enter phone number");
      return false;
    }
    return true;
  };

  // 1. Trigger Mock Gateway Flow (for Card or UPI)
  const handleStartMockPayment = (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    if (paymentMethod === "card_mock") {
      if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, "").length < 15) {
        toast.error("Please enter a valid 16-digit card number");
        return;
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        toast.error("Please enter valid card expiry (MM/YY)");
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        toast.error("Please enter valid 3-digit CVV");
        return;
      }

      const last4 = cardData.cardNumber.replace(/\s/g, "").slice(-4);
      setPendingPaymentDetails({
        cardHolder: cardData.cardHolder,
        cardBrand: cardData.cardNumber.startsWith("4") ? "Visa" : "Mastercard",
        last4,
        paymentType: "Mock Credit/Debit Card",
      });
      setShowMockModal(true);
    } else if (paymentMethod === "upi_mock") {
      if (!upiId || !upiId.includes("@")) {
        toast.error("Please enter a valid UPI ID (e.g. name@bank)");
        return;
      }
      setPendingPaymentDetails({
        upiId,
        paymentType: "Mock UPI Instant Transfer",
      });
      setShowMockModal(true);
    }
  };

  // 2. Mock Gateway Success Callback -> Creates Order & Navigates
  const handlePaymentApproved = async (paymentResult) => {
    setShowMockModal(false);
    try {
      setSubmitting(true);

      const formattedItems = cartProducts.map((p) => ({
        productId: p.productId?._id || p.productId,
        name: p.name,
        image: p.image,
        price: p.price,
        size: p.size,
        color: p.color,
        quantity: p.quantity,
      }));

      const finalOrder = await dispatch(
        createDirectOrder({
          orderItems: formattedItems,
          shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            zipCode: shippingAddress.zipCode,
            state: shippingAddress.state,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          },
          paymentMethod:
            paymentMethod === "card_mock"
              ? "Credit Card (Mock)"
              : paymentMethod === "upi_mock"
              ? "UPI (Mock)"
              : "PayPal Sandbox",
          totalPrice: grandTotal,
          isPaid: true,
          paymentStatus: "paid",
          paymentDetails: paymentResult,
        })
      ).unwrap();

      dispatch(clearCart());
      toast.success("Order confirmed successfully!");
      navigate("/order-confirmation", { state: { order: finalOrder } });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Cash on Delivery Flow
  const handlePlaceOrderCOD = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    try {
      setSubmitting(true);
      const formattedItems = cartProducts.map((p) => ({
        productId: p.productId?._id || p.productId,
        name: p.name,
        image: p.image,
        price: p.price,
        size: p.size,
        color: p.color,
        quantity: p.quantity,
      }));

      const finalOrder = await dispatch(
        createDirectOrder({
          orderItems: formattedItems,
          shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            zipCode: shippingAddress.zipCode,
            state: shippingAddress.state,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          },
          paymentMethod: "Cash on Delivery",
          totalPrice: grandTotal,
          isPaid: false,
          paymentStatus: "pending",
          paymentDetails: {
            status: "pending",
            provider: "Cash on Delivery",
          },
        })
      ).unwrap();

      dispatch(clearCart());
      toast.success("Cash on Delivery order placed!");
      navigate("/order-confirmation", { state: { order: finalOrder } });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Real PayPal Flow
  const handlePayPalApproved = async (details) => {
    try {
      setSubmitting(true);
      const formattedItems = cartProducts.map((p) => ({
        productId: p.productId?._id || p.productId,
        name: p.name,
        image: p.image,
        price: p.price,
        size: p.size,
        color: p.color,
        quantity: p.quantity,
      }));

      const finalOrder = await dispatch(
        createDirectOrder({
          orderItems: formattedItems,
          shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          },
          paymentMethod: "PayPal",
          totalPrice: grandTotal,
          isPaid: true,
          paymentStatus: "paid",
          paymentDetails: details,
        })
      ).unwrap();

      dispatch(clearCart());
      toast.success("PayPal payment confirmed!");
      navigate("/order-confirmation", { state: { order: finalOrder } });
    } catch (err) {
      toast.error("Failed to complete PayPal order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-7xl">
      {/* Mock Payment Simulation Gateway Modal */}
      <MockPaymentModal
        isOpen={showMockModal}
        onClose={() => setShowMockModal(false)}
        onPaymentSuccess={handlePaymentApproved}
        totalAmount={grandTotal}
        paymentMethod={
          paymentMethod === "card_mock"
            ? "Credit Card (Mock)"
            : "UPI / NetBanking (Mock)"
        }
        paymentDetails={pendingPaymentDetails}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-gray-900">
            Secure Checkout
          </h1>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
            <FiShield className="text-emerald-600" />
            <span>SSL Secured Checkout &bull; 100% Guaranteed Delivery</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          <span>Signed in as:</span>
          <span className="font-bold text-gray-900">{user?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form: Shipping, Delivery Speed & Payment Options */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Shipping Address */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Delivery Address</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={shippingAddress.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={shippingAddress.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  placeholder="Flat No, Building, Street Name"
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="Bangalore"
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  State / Region
                </label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  placeholder="Karnataka"
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  PIN / Postal Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  placeholder="560001"
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Speed */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Delivery Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  shippingMethod === "standard"
                    ? "border-black bg-gray-50/70"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mt-1 accent-black"
                  />
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">
                      Standard Shipping
                    </span>
                    <span className="text-xs text-gray-500">
                      Delivered in 3-5 business days
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                  FREE
                </span>
              </label>

              <label
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  shippingMethod === "express"
                    ? "border-black bg-gray-50/70"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mt-1 accent-black"
                  />
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">
                      Express Courier
                    </span>
                    <span className="text-xs text-gray-500">
                      Delivered in 1-2 business days
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                  ₹99
                </span>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Options & Mock Simulator */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Payment Method</span>
              </h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <FiShield className="text-xs" />
                <span>Simulated Mock Ready</span>
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod("card_mock")}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer ${
                  paymentMethod === "card_mock"
                    ? "border-black bg-gray-950 text-white shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                }`}
              >
                <FiCreditCard className="text-xl" />
                <span className="text-xs font-bold">Card (Mock)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("upi_mock")}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer ${
                  paymentMethod === "upi_mock"
                    ? "border-black bg-gray-950 text-white shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                }`}
              >
                <FiSmartphone className="text-xl" />
                <span className="text-xs font-bold">UPI / QR (Mock)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer ${
                  paymentMethod === "paypal"
                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                }`}
              >
                <FaPaypal className="text-xl" />
                <span className="text-xs font-bold">PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-emerald-600 bg-emerald-700 text-white shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                }`}
              >
                <FiDollarSign className="text-xl" />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </button>
            </div>

            {/* TAB CONTENT: Mock Credit / Debit Card Form */}
            {paymentMethod === "card_mock" && (
              <div className="bg-gray-50/80 p-5 sm:p-6 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-gray-700">
                      Credit / Debit Card Simulation
                    </span>
                    <FaCcVisa className="text-blue-700 text-xl" />
                    <FaCcMastercard className="text-orange-600 text-xl" />
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDemoCard}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                  >
                    Use Demo Card
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      placeholder="4532 8888 9999 1234"
                      className="w-full p-2.5 text-sm font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                      maxLength={19}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={cardData.cardHolder}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="12/28"
                        className="w-full p-2.5 text-sm font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="888"
                        className="w-full p-2.5 text-sm font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartMockPayment}
                  disabled={submitting}
                  className="w-full mt-2 bg-black text-white py-4 rounded-xl font-extrabold uppercase tracking-wider text-sm hover:bg-gray-800 transition active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-50"
                >
                  Pay ₹{grandTotal.toLocaleString()} via Card (Simulated)
                </button>
              </div>
            )}

            {/* TAB CONTENT: Mock UPI / QR Code */}
            {paymentMethod === "upi_mock" && (
              <div className="bg-gray-50/80 p-5 sm:p-6 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-gray-700">
                    UPI Instant Transfer (Google Pay, PhonePe, Paytm)
                  </span>
                  <div className="flex items-center gap-2 text-lg text-gray-600">
                    <SiGooglepay />
                    <SiPhonepe />
                    <SiPaytm />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center p-4 bg-white rounded-xl border border-gray-200">
                  {/* Simulated QR Code Graphic */}
                  <div className="w-32 h-32 bg-gray-900 rounded-xl p-2.5 flex flex-col items-center justify-between text-white flex-shrink-0 shadow-xs">
                    <div className="w-full flex justify-between text-[8px] font-mono">
                      <span>UPI</span>
                      <span>MARTIFY</span>
                    </div>
                    <div className="w-20 h-20 bg-white rounded-lg p-1 grid grid-cols-4 gap-0.5">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className={`${
                            i % 2 === 0 || i % 5 === 0 ? "bg-black" : "bg-white"
                          } rounded-xs`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-[8px] font-bold">SCAN TO PAY</span>
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        Enter Your VPA / UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black font-mono bg-white"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      You will see a mock authorization prompt simulated instantly without deducting real money.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartMockPayment}
                  disabled={submitting}
                  className="w-full bg-black text-white py-4 rounded-xl font-extrabold uppercase tracking-wider text-sm hover:bg-gray-800 transition active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-50"
                >
                  Authorize UPI Payment (₹{grandTotal.toLocaleString()})
                </button>
              </div>
            )}

            {/* TAB CONTENT: PayPal & PayPal Mock fallback */}
            {paymentMethod === "paypal" && (
              <div className="bg-gray-50/80 p-5 sm:p-6 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-800 uppercase">
                    PayPal Sandbox &amp; Cards
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    Approx. ${(grandTotal / 85).toFixed(2)} USD
                  </span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <PayPalButton
                    amount={(grandTotal / 85).toFixed(2)}
                    onSuccess={handlePayPalApproved}
                    onError={() =>
                      toast.error("PayPal error. You can use 1-Click Mock PayPal below.")
                    }
                  />
                </div>

                {/* 1-Click Sandbox Simulator */}
                <div className="pt-2 border-t text-center">
                  <p className="text-xs text-gray-500 mb-2 font-medium">
                    Testing sandbox or having connection issues with PayPal?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!validateAddress()) return;
                      setPendingPaymentDetails({
                        provider: "PayPal Sandbox 1-Click Simulator",
                        payerId: "PAYER_TEST_123",
                      });
                      setShowMockModal(true);
                    }}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow"
                  >
                    Simulate PayPal Instant Approval (1-Click)
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Cash on Delivery */}
            {paymentMethod === "cod" && (
              <div className="bg-gray-50/80 p-5 sm:p-6 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                    <FiDollarSign className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Cash on Delivery
                    </h4>
                    <p className="text-xs text-gray-500">
                      Pay with cash or card upon package arrival at your door.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                  <FiAlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Please ensure the exact amount of ₹{grandTotal.toLocaleString()} is available at the delivery address.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrderCOD}
                  disabled={submitting || checkoutLoading}
                  className="w-full bg-black text-white py-4 rounded-xl font-extrabold uppercase tracking-wider text-sm hover:bg-gray-800 transition active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Placing Order..." : `Confirm COD Order (₹${grandTotal.toLocaleString()})`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary: Items, Coupons & Totals */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs sticky top-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider">
                Order Summary ({cartProducts.length} items)
              </h2>
            </div>

            {/* Items scroll */}
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {cartProducts.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 object-cover object-top rounded-xl border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900 whitespace-nowrap">
                    ₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon (e.g. MARTIFY10)"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black uppercase font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Applied Coupon Badge */}
              {appliedCoupon && (
                <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-bold flex items-center gap-1.5">
                    <FiCheck className="text-emerald-600" />
                    <span>{appliedCoupon.label}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
                  >
                    &times; Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-t pt-4 space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ₹{rawSubtotal.toLocaleString()}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-₹{couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === "express" ? "Express" : "Standard"})</span>
                <span
                  className={
                    shippingCost === 0
                      ? "text-emerald-600 font-bold uppercase"
                      : "font-semibold text-gray-900"
                  }
                >
                  {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxes &amp; Duties</span>
                <span className="text-gray-400">Included</span>
              </div>

              <div className="border-t pt-3 flex justify-between items-baseline text-gray-900">
                <span className="text-sm font-extrabold uppercase tracking-wider">
                  Total Payable
                </span>
                <span className="text-2xl font-black">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3 text-[11px] text-gray-500">
              <FiShield className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span>
                30-day money-back guarantee with zero risk return policy.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
