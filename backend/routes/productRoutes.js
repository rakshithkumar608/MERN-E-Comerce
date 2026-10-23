// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

// @route POST /api/products
// @desc Create a new product
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
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      colors: Array.isArray(colors) ? colors : [colors],
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
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/products/:id
// @desc Update an existing product
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
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

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (countInStock !== undefined) product.countInStock = Number(countInStock);
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (sizes !== undefined) product.sizes = Array.isArray(sizes) ? sizes : [sizes];
    if (colors !== undefined) product.colors = Array.isArray(colors) ? colors : [colors];
    if (collections !== undefined) product.collections = collections;
    if (material !== undefined) product.material = material;
    if (gender !== undefined) product.gender = gender;
    if (images !== undefined) product.images = Array.isArray(images) ? images : [];
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isPublished !== undefined) product.isPublished = Boolean(isPublished);
    if (tags !== undefined) product.tags = Array.isArray(tags) ? tags : [];
    if (dimensions !== undefined) product.dimensions = dimensions;
    if (weight !== undefined) product.weight = Number(weight);
    if (sku !== undefined) product.sku = sku;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/products/best-seller
// @desc Retrieve the product with highest rating
// @access Public
router.get("/best-seller", async (req, res) => {
  try {
    let bestSeller = await Product.findOne().sort({ rating: -1, numReviews: -1 });
    if (!bestSeller) {
      bestSeller = await Product.findOne();
    }
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No best seller found" });
    }
  } catch (error) {
    console.error("Error fetching best seller:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/products/new-arrivals
// @desc Retrieve latest products
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(12);
    res.json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/products/similar/:id
// @desc Retrieve similar products based on category / gender
// @access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product Not found" });
    }

    let query = { _id: { $ne: id } };
    if (product.gender) {
      query.gender = product.gender;
    }
    if (product.category) {
      query.category = product.category;
    }

    let similarProducts = await Product.find(query).limit(8);
    // If not enough similar products found, fallback to any other products
    if (similarProducts.length < 4) {
      const extra = await Product.find({ _id: { $ne: id, $nin: similarProducts.map((p) => p._id) } }).limit(
        8 - similarProducts.length
      );
      similarProducts = [...similarProducts, ...extra];
    }

    res.json(similarProducts);
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    // Filter collection
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = { $regex: new RegExp(collection, "i") };
    }

    // Filter category
    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: new RegExp(category, "i") };
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: color.split(",") };
    }

    if (gender) {
      query.gender = { $regex: new RegExp(`^${gender}$`, "i") };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Sort logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1, numReviews: -1 };
          break;
        default:
          sort = { createdAt: -1 };
          break;
      }
    } else {
      sort = { createdAt: -1 };
    }

    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
