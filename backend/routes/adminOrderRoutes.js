const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { status } = req.body;
    if (status) {
      order.status = status;
      if (status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else if (status === "Cancelled") {
        order.isDelivered = false;
      }
    }

    const updatedOrder = await order.save();
    const populated = await Order.findById(updatedOrder._id).populate("user", "name email");
    res.json(populated || updatedOrder);
  } catch (error) {
    console.error("Admin order update error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Admin order delete error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
