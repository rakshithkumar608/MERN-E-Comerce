import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiStar, FiCheck, FiShoppingBag } from "react-icons/fi";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice.js";
import { addToCart } from "../../redux/slices/cartSlice.js";
import ProductGrid from "./ProductGrid.jsx";

const ProductDetails = ({ productId: propProductId }) => {
  const { id: routeId } = useParams();
  const productId = propProductId || routeId;

  const dispatch = useDispatch();
  const { selectedProduct, similarProducts, loading, error } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
      dispatch(fetchSimilarProducts({ id: productId }));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    } else if (selectedProduct?.image) {
      setMainImage(selectedProduct.image);
    }
    if (selectedProduct?.sizes?.length > 0) {
      setSelectedSize(selectedProduct.sizes[0]);
    }
    if (selectedProduct?.colors?.length > 0) {
      setSelectedColor(selectedProduct.colors[0]);
    }
    setQuantity(1);
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    if (!selectedSize && selectedProduct.sizes?.length > 0) {
      toast.error("Please select a size.");
      return;
    }
    if (!selectedColor && selectedProduct.colors?.length > 0) {
      toast.error("Please select a color.");
      return;
    }

    try {
      setIsAdding(true);
      await dispatch(
        addToCart({
          productId: selectedProduct._id,
          quantity,
          size: selectedSize || "Standard",
          color: selectedColor || "Default",
          userId: user?._id,
          guestId,
        })
      ).unwrap();

      toast.success(`${selectedProduct.name} added to cart!`);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading && !selectedProduct) {
    return (
      <div className="max-w-6xl mx-auto p-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !selectedProduct) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link
          to="/collections/all"
          className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!selectedProduct) return null;

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Thumbnails (Desktop) */}
          {selectedProduct.images && selectedProduct.images.length > 1 && (
            <div className="hidden md:flex flex-col space-y-3">
              {selectedProduct.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMainImage(image.url)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    mainImage === image.url
                      ? "border-black shadow-sm"
                      : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="flex-1 max-w-lg mx-auto">
            <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={mainImage || selectedProduct.images?.[0]?.url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-top"
              />
              {selectedProduct.discountPrice && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow">
                  Sale
                </span>
              )}
            </div>

            {/* Mobile Thumbnails */}
            {selectedProduct.images && selectedProduct.images.length > 1 && (
              <div className="md:hidden flex overflow-x-auto space-x-3 mt-4 pb-2">
                {selectedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setMainImage(image.url)}
                    className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 ${
                      mainImage === image.url ? "border-black" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `Thumb ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details */}
          <div className="flex-1 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                {selectedProduct.brand || selectedProduct.category}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {selectedProduct.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(selectedProduct.rating || 4)
                          ? "fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  ({selectedProduct.numReviews || 12} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                ₹{Number(selectedProduct.price).toLocaleString()}
              </span>
              {selectedProduct.discountPrice &&
                selectedProduct.discountPrice > selectedProduct.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{Number(selectedProduct.discountPrice).toLocaleString()}
                  </span>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed border-t border-b py-4">
              {selectedProduct.description}
            </p>

            {/* Colors */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                  Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        selectedColor === color
                          ? "bg-black text-white border-black"
                          : "bg-gray-50 text-gray-800 border-gray-300 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                  Size: <span className="font-normal text-gray-600">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[40px] px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange("minus")}
                    className="px-3 py-1.5 text-base font-bold hover:bg-gray-100 transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange("plus")}
                    className="px-3 py-1.5 text-base font-bold hover:bg-gray-100 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <FiShoppingBag className="text-lg" />
                <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
              </button>
            </div>

            {/* Product Meta Specifications */}
            <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
              <p>
                <strong className="text-gray-700">SKU:</strong> {selectedProduct.sku}
              </p>
              {selectedProduct.material && (
                <p>
                  <strong className="text-gray-700">Material:</strong>{" "}
                  {selectedProduct.material}
                </p>
              )}
              {selectedProduct.gender && (
                <p>
                  <strong className="text-gray-700">Gender:</strong>{" "}
                  {selectedProduct.gender}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <ProductGrid products={similarProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
