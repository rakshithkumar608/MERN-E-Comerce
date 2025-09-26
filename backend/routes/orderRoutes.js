const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

//@route GET/api/orders/my-orders
//@desc Get logged-in users orders
//@access private
router.get("/my-orders", protect, async(req, res) =>{
  try {
    //find orders for the authentiacated users
    const orders = (await Order.find({ user: req.user._id })).toSorted({
      createdAt: -1,
    });//sort by most recent orders
    res.json(orders);
  } catch (error) {
     console.error(error);
    res.status(500).json({ message: "Server Error"});
  }
});

// @route GET/api/orders/:id
//@desc vGet orders details by ID
//@access private
router.get("/:id", protect, async (req, res) =>{
  try {
   const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
   ) ;

   if (!order){
    return res.status(404).json({message: "Order not found"});
   }

   //return the full order details
   res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error"});
  }
})

module.exports = router;