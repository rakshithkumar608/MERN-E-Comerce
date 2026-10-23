import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice.js";
import { toast } from "sonner";

const CartContents = ({ onActionComplete }) => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);

  const cartProducts = cart?.products || [];

  const handleQuantityChange = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    try {
      await dispatch(
        updateCartItemQuantity({
          productId: item.productId?._id || item.productId,
          quantity: newQty,
          size: item.size,
          color: item.color,
          userId: user?._id,
          guestId,
        })
      ).unwrap();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to update quantity");
    }
  };

  const handleRemove = async (item) => {
    try {
      await dispatch(
        removeFromCart({
          productId: item.productId?._id || item.productId,
          size: item.size,
          color: item.color,
          userId: user?._id,
          guestId,
        })
      ).unwrap();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to remove item");
    }
  };

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-4xl mb-3">🛒</div>
        <p className="text-base font-semibold text-gray-800 mb-1">Your cart is empty</p>
        <p className="text-xs text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
        <Link
          to="/collections/all"
          onClick={onActionComplete}
          className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-gray-800 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {cartProducts.map((product, index) => (
        <div key={`${product.productId}-${product.size}-${product.color}-${index}`} className="flex items-start justify-between py-4 gap-3">
          <div className="flex items-start gap-3">
            <img
              src={product.image || "https://picsum.photos/150?random=1"}
              alt={product.name}
              className="w-16 h-20 sm:w-20 sm:h-24 object-cover object-top rounded-lg border border-gray-100 flex-shrink-0"
            />

            <div>
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Size: <span className="font-medium text-gray-700">{product.size}</span> | Color:{" "}
                <span className="font-medium text-gray-700">{product.color}</span>
              </p>
              <p className="text-xs font-semibold text-gray-900 mt-1">
                ₹{Number(product.price).toLocaleString()}
              </p>

              <div className="flex items-center mt-2.5 border border-gray-200 rounded-md w-fit">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product, -1)}
                  disabled={loading}
                  className="px-2 py-0.5 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-100 transition cursor-pointer disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-2.5 py-0.5 text-xs font-bold text-gray-900">
                  {product.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product, 1)}
                  disabled={loading}
                  className="px-2 py-0.5 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-100 transition cursor-pointer disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end justify-between self-stretch">
            <span className="text-sm font-bold text-gray-900">
              ₹{(Number(product.price) * Number(product.quantity)).toLocaleString()}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(product)}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-red-600 transition cursor-pointer"
              title="Remove item"
            >
              <RiDeleteBin3Line className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
