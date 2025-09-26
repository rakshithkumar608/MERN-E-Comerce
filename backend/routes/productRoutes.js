// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require("../models/Product"); // Product model
const { protect, admin } = require("../middleware/authMiddleware"); // Just middleware




//@route POST /api/products
// @desc create a new product
// @access private/admin
router.post("/", protect,admin,  async (req, res) => {
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
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new protect(
      {
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
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, //reference to the admin user who created it
    })

    const createdProduct = await product.saved();
    res.status(201).json(createdProduct)

  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

// @route put/api/products/:id
// @desc update an existing product ID
// @access private/admin
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
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;


    //Find product byy Id

    const product = await Product.findById(req.params.id);

    if (product) {
      //update products fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured = isFeatured !== undefined ? isFeatured :  product.isFeatured;
        product.isPublished = isPublished !== undefined ? isPublished :  product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;


      //save the updated products
      const updatedProduct = await product.save();
      res.json(updatedProduct);
   }else {
    res.status(404).json({message: "product not found"})
   }
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
});

//@route DELETE /api/products/:id
// @desc DELETE a product by ID
// @access private/admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    //Find the product by id
    const product = await Product.findById(req.params.id);

    if(product) {
      //remove the product from db
      await product.deleteOne();
      res.json({message: "product removed"});
    } else {
      res.status(404).json({message: "product not found"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

// @route GET/api/products
// @desc Get all products with optional query filters
//@access public
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
       limit 
      } = req.query;

      let query = {};

      //Filter logic
      if(collection && collection.toLocalLowerCase() !== "alt") {
        query.collections = collection;
      }

       if(category && category.toLocalLowerCase() !== "alt") {
        query.category = category;
      }
      
      if(material) {
        query.material = {$in: material.split(",")};
      }

        if(brand) {
        query.brand = {$in: brand.split(",")};
      }

        if(size) {
        query.sizes = {$in: size.split(",")};
      }

      if(color) {
        query.color = {$in: [color]};
      }

      if(gender) {
        query.gender = gender;
      }

      if(minPrice || maxPrice){
        query.price = {};
        if(minPrice) query.price.$gte = Number(minPrice)
         if(maxPrice) query.price.$lte = Number(maxPrice)  
      }

      if(search) {
        query.$or = [
          {name: {$regex: search, $options: "i"}},
          {description: {$regex: search, $options: "i"}},
        ];
      }

      // sort logic
      let sort = {};
      if(sortBy) {
        switch (sortBy) {
          case "priceAsc":
            sort = { price:1 };
            break;
          case "priceDesc":
            sort = { price:-1 };
            break;
          case "popularity":
            sort = { rating: -1 };
            break;
            default:
              break;
          }
      }

      //Fetch products and apply sorting and limit

      let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
      res.json(products);
     } catch (error) {
    console.error(error);
    res.status(500).send("server Error");
  }
});

//@route GET/ api/products/best-selleer
// @desc retrive the product with highest rating
//@access public
router.get("/best-seller", async (req, res) =>{
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1});
    if (bestSeller) {
      res.json(bestSeller);
    }else {
     res.status(404).json({message:  "No best Seller found"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
    }
  });

  //@ route GET/api/products/new-arrivals
  //@desc retirive latest 8 products - creation date
  //@access public

  router.get("/new-arrivals", async (req, res) => {
    try {
      // Fetch latest 12 products
      const newArrivals = await Product.find().sort({ createdAt: -1}).limit(12);
      res.json(newArrivals)
    } catch (error) {
       console.error(error);
    res.status(500).send("Server Error")
    }
  })

// @route GET /api/products/:id
// @desc get a single product by ID
// @access products

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product) {
      res.json(product);
    }else {
     console.error(error);
    res.status(500).send("Server Error");
    }
  } catch (error) {}
})


// @roue GET/api/products/similar/:id
//@desc retrives similar products based on the current products gender and category
//@access public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
 
  try {
    const product = await Product.findById(id);

    if(!product) {
      return res.status(404).json({message: "Product Not found"});
    }

    const similarProducts = await Product.find({
      _id: {$ne : id},
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error");
  }
  
});

//@route GET/ api/products/best-selleer
// @desc retrive the product with highest rating
//@access public
router.get("/best-seller", async (req, res) =>{
  try {
    res.send("this should not work")
  } catch (error) {
    
  }
})
module.exports = router;