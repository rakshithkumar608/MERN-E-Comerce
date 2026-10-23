const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/checkout/create-order
// @desc Directly create an order with mock / gateway / COD payment
// @access Private
router.post("/create-order", protect, async (req, res) => {
  const {
    orderItems,
    checkoutItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    isPaid,
    paymentStatus,
    paymentDetails,
  } = req.body;

  const rawItems = orderItems || checkoutItems;

  if (!rawItems || rawItems.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  try {
    const formattedItems = rawItems.map((item) => ({
      productId: item.productId?._id || item.productId,
      name: item.name,
      image: item.image,
      price: Number(item.price),
      size: item.size || "Standard",
      color: item.color || "Default",
      quantity: Number(item.quantity) || 1,
    }));

    const isOrderPaid =
      Boolean(isPaid) ||
      paymentStatus === "paid" ||
      paymentStatus === "COMPLETED" ||
      paymentMethod === "Credit Card (Mock)" ||
      paymentMethod === "UPI (Mock)" ||
      paymentMethod === "Net Banking (Mock)";

    const newOrder = await Order.create({
      user: req.user._id,
      orderItems: formattedItems,
      shippingAddress,
      paymentMethod: paymentMethod || "Credit Card (Mock)",
      totalPrice: Number(totalPrice),
      isPaid: isOrderPaid,
      paidAt: isOrderPaid ? Date.now() : undefined,
      isDelivered: false,
      paymentStatus: isOrderPaid ? "paid" : "pending",
      paymentDetails: paymentDetails || {
        status: isOrderPaid ? "paid" : "pending",
        transactionId: `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        provider: paymentMethod || "Direct",
      },
      status: "Processing",
    });

    // Clear user cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Direct order creation error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod: paymentMethod || "PayPal",
      totalPrice: Number(totalPrice),
      paymentStatus: "pending",
      isPaid: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    const isSuccessful =
      paymentStatus === "paid" ||
      paymentStatus === "COMPLETED" ||
      paymentStatus === "completed" ||
      (paymentDetails && (paymentDetails.status === "COMPLETED" || paymentDetails.status === "paid"));

    if (isSuccessful || paymentStatus) {
      checkout.isPaid = true;
      checkout.paymentStatus = "paid";
      checkout.paymentDetails = paymentDetails || { status: "COMPLETED" };
      checkout.paidAt = Date.now();
      await checkout.save();

      return res.status(200).json(checkout);
    } else {
      return res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error("Payment status update error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    const isCOD =
      checkout.paymentMethod === "COD" ||
      checkout.paymentMethod === "Cash on Delivery";

    if (checkout.isPaid || isCOD) {
      const orderItems = (checkout.checkoutItems || []).map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size || "Standard",
        color: item.color || "Default",
        quantity: item.quantity,
      }));

      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: checkout.isPaid,
        paidAt: checkout.paidAt || (checkout.isPaid ? Date.now() : undefined),
        isDelivered: false,
        paymentStatus: checkout.isPaid ? "paid" : "pending",
        paymentDetails: checkout.paymentDetails,
        status: "Processing",
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      checkout.finalzedAt = checkout.finalizedAt;
      await checkout.save();

      // Delete user cart
      await Cart.findOneAndDelete({ user: checkout.user });

      return res.status(201).json(finalOrder);
    } else {
      return res.status(400).json({ message: "Checkout is not paid yet" });
    }
  } catch (error) {
    console.error("Finalize checkout error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
