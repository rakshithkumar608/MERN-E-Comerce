const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Admin products fetch error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/admin/products
// @desc Create a new product (Admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      countInStock: Number(countInStock) || 0,
      category,
      brand,
      sizes: Array.isArray(sizes) ? sizes : typeof sizes === "string" ? sizes.split(",").map(s => s.trim()) : [],
      colors: Array.isArray(colors) ? colors : typeof colors === "string" ? colors.split(",").map(c => c.trim()) : [],
      collections: collections || "all",
      material,
      gender,
      images: Array.isArray(images) ? images : [],
      isFeatured: Boolean(isFeatured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      tags: Array.isArray(tags) ? tags : [],
      dimensions,
      weight: weight ? Number(weight) : undefined,
      sku: sku || `SKU-${Date.now()}`,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Admin product creation error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/admin/products/:id
// @desc Update product (Admin only)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (countInStock !== undefined) product.countInStock = Number(countInStock);
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (sizes !== undefined) product.sizes = Array.isArray(sizes) ? sizes : typeof sizes === "string" ? sizes.split(",").map(s => s.trim()) : product.sizes;
    if (colors !== undefined) product.colors = Array.isArray(colors) ? colors : typeof colors === "string" ? colors.split(",").map(c => c.trim()) : product.colors;
    if (collections !== undefined) product.collections = collections;
    if (material !== undefined) product.material = material;
    if (gender !== undefined) product.gender = gender;
    if (images !== undefined) product.images = Array.isArray(images) ? images : product.images;
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isPublished !== undefined) product.isPublished = Boolean(isPublished);
    if (tags !== undefined) product.tags = Array.isArray(tags) ? tags : product.tags;
    if (dimensions !== undefined) product.dimensions = dimensions;
    if (weight !== undefined) product.weight = Number(weight);
    if (sku !== undefined) product.sku = sku;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Admin product update error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/admin/products/:id
// @desc Delete product (Admin only)
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error("Admin product delete error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
