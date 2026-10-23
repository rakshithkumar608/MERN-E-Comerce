const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get cart by userId or guestId
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// Helper function to calculate total price
const calcTotalPrice = (products) => {
  return products.reduce((acc, item) => {
    return acc + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);
};

// @route POST /api/cart
// @desc Add a product to the cart for a guest or a logged in user
// @access Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  const numQuantity = Number(quantity) || 1;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imageUrl =
      product.images && product.images.length > 0
        ? product.images[0].url
        : "https://picsum.photos/500/500?random=1";

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          (size ? p.size === size : true) &&
          (color ? p.color === color : true)
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += numQuantity;
      } else {
        cart.products.push({
          productId: product._id,
          name: product.name,
          image: imageUrl,
          price: product.price,
          size: size || (product.sizes && product.sizes[0]) || "Standard",
          color: color || (product.colors && product.colors[0]) || "Default",
          quantity: numQuantity,
        });
      }

      cart.totalPrice = calcTotalPrice(cart.products);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        user: userId || undefined,
        guestId: guestId || `guest_${Date.now()}`,
        products: [
          {
            productId: product._id,
            name: product.name,
            image: imageUrl,
            price: product.price,
            size: size || (product.sizes && product.sizes[0]) || "Standard",
            color: color || (product.colors && product.colors[0]) || "Default",
            quantity: numQuantity,
          },
        ],
        totalPrice: product.price * numQuantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/cart
// @desc Update product quantity in cart
// @access Public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  const numQuantity = Number(quantity);

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        (size ? p.size === size : true) &&
        (color ? p.color === color : true)
    );

    if (productIndex > -1) {
      if (numQuantity > 0) {
        cart.products[productIndex].quantity = numQuantity;
      } else {
        cart.products.splice(productIndex, 1);
      }
      cart.totalPrice = calcTotalPrice(cart.products);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Update cart error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/cart
// @desc Remove a product from cart
// @access Public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        (size ? p.size === size : true) &&
        (color ? p.color === color : true)
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = calcTotalPrice(cart.products);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Delete cart error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/cart
// @desc Get logged-in user's or guest user's cart
// @access Public
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.json({ products: [], totalPrice: 0 });
    }
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    if (!guestId) {
      const userCart = await Cart.findOne({ user: req.user._id });
      return res.status(200).json(userCart || { products: [], totalPrice: 0 });
    }

    const guestCart = await Cart.findOne({ guestId });
    let userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart && guestCart.products.length > 0) {
      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });

        userCart.totalPrice = calcTotalPrice(userCart.products);
        await userCart.save();
        await Cart.findOneAndDelete({ guestId });
        return res.status(200).json(userCart);
      } else {
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();
        return res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        return res.status(200).json(userCart);
      }
      return res.status(200).json({ products: [], totalPrice: 0 });
    }
  } catch (error) {
    console.error("Merge cart error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
