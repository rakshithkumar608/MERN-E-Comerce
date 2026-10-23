import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import {
  createProduct,
  updateProduct,
} from "../../redux/slices/adminProductSlice.js";
import { fetchProductDetails } from "../../redux/slices/productsSlice.js";
import { FiArrowLeft, FiUploadCloud, FiTrash2 } from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

const EditProductPage = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "20",
    sku: "",
    category: "Top Wear",
    brand: "",
    sizes: "S, M, L, XL",
    colors: "Black, White, Blue",
    collections: "all",
    material: "Cotton",
    gender: "Men",
    isFeatured: false,
    images: [],
  });

  // If editing, load product details
  useEffect(() => {
    if (!isNew && id) {
      const loadProduct = async () => {
        try {
          const res = await dispatch(fetchProductDetails(id)).unwrap();
          setFormData({
            name: res.name || "",
            description: res.description || "",
            price: res.price || "",
            discountPrice: res.discountPrice || "",
            countInStock: res.countInStock !== undefined ? res.countInStock : "20",
            sku: res.sku || "",
            category: res.category || "Top Wear",
            brand: res.brand || "",
            sizes: Array.isArray(res.sizes) ? res.sizes.join(", ") : res.sizes || "",
            colors: Array.isArray(res.colors) ? res.colors.join(", ") : res.colors || "",
            collections: res.collections || "all",
            material: res.material || "",
            gender: res.gender || "Men",
            isFeatured: Boolean(res.isFeatured),
            images: Array.isArray(res.images) ? res.images : [],
          });
        } catch (err) {
          toast.error("Failed to load product details");
        }
      };
      loadProduct();
    }
  }, [dispatch, id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append("image", file);

      const res = await axios.post(`${API_URL}/api/upload`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, { url: res.data.imageUrl, altText: prev.name }],
        }));
        toast.success("Image uploaded successfully!");
      }
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in required fields (Name, Price, Category)");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      countInStock: Number(formData.countInStock) || 0,
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Standard"],
      colors: formData.colors
        ? formData.colors.split(",").map((c) => c.trim()).filter(Boolean)
        : ["Default"],
      sku: formData.sku || `SKU-${Date.now()}`,
      images:
        formData.images.length > 0
          ? formData.images
          : [{ url: "https://picsum.photos/500/500?random=1", altText: formData.name }],
    };

    try {
      setSubmitting(true);
      if (isNew) {
        await dispatch(createProduct(payload)).unwrap();
        toast.success("Product created successfully!");
      } else {
        await dispatch(updateProduct({ id, productData: payload })).unwrap();
        toast.success("Product updated successfully!");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black mb-1"
          >
            <FiArrowLeft />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isNew ? "Create New Product" : `Edit Product: ${formData.name}`}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6"
      >
        {/* Name & SKU */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Classic Oxford Button-Down Shirt"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Auto-generated if empty"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black font-mono"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Detailed description of materials, fit, care instructions..."
            className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              step="any"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="499"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Discount Price / MRP (₹)
            </label>
            <input
              type="number"
              step="any"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              placeholder="999"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Category, Gender, Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="Top Wear">Top Wear</option>
              <option value="Bottom Wear">Bottom Wear</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Modern Fit"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Sizes & Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Sizes (comma separated)
            </label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              placeholder="S, M, L, XL, XXL"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Colors (comma separated)
            </label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              placeholder="Black, Blue, White, Red"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Images Upload Section */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Product Images
          </label>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {formData.images.map((img, i) => (
              <div
                key={i}
                className="relative w-24 h-28 rounded-xl overflow-hidden border border-gray-200 group"
              >
                <img
                  src={img.url}
                  alt={img.altText || `Image ${i}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition cursor-pointer"
                  title="Remove image"
                >
                  <FiTrash2 className="h-3 w-3" />
                </button>
              </div>
            ))}

            <label className="w-24 h-28 border-2 border-dashed border-gray-300 hover:border-black rounded-xl flex flex-col items-center justify-center cursor-pointer transition bg-gray-50 hover:bg-gray-100">
              <FiUploadCloud className="h-6 w-6 text-gray-400 mb-1" />
              <span className="text-[11px] font-bold text-gray-600">
                {uploading ? "Uploading..." : "Add Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="h-4 w-4 accent-black rounded"
          />
          <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-800 cursor-pointer">
            Feature this product on homepage
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition shadow disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
