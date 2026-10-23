import React from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartProducts = cart?.products || [];
  const totalPrice = cartProducts.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      {/* Background Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity"
          onClick={toggleCartDrawer}
        />
      )}

      <div
        className={`fixed top-0 right-0 w-full sm:w-[420px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Your Cart</h2>
            <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-full">
              {cartProducts.length} items
            </span>
          </div>
          <button
            onClick={toggleCartDrawer}
            className="p-1 text-gray-500 hover:text-black focus:outline-none"
            aria-label="Close cart"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Cart Content */}
        <div className="flex-grow p-4 overflow-y-auto">
          <CartContents onActionComplete={toggleCartDrawer} />
        </div>

        {/* Checkout Footer */}
        {cartProducts.length > 0 && (
          <div className="p-4 bg-gray-50 border-t space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-lg font-extrabold text-gray-900">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 text-center">
              Shipping & taxes calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition active:scale-[0.99] cursor-pointer shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
