import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import registerImg from "../assets/register2.avif";
import { registerUser, clearAuthError } from "../redux/slices/authSlice.js";
import { mergeCart, fetchCart } from "../redux/slices/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, guestId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (guestId) {
        dispatch(mergeCart({ guestId, userId: user._id })).then(() => {
          dispatch(fetchCart({ userId: user._id, guestId }));
        });
      }
      navigate("/");
    }
  }, [user, guestId, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 7) {
      toast.error("Password must be at least 7 characters.");
      return;
    }

    try {
      const result = await dispatch(
        registerUser({ name, email, password })
      ).unwrap();
      toast.success(`Account created! Welcome, ${result.name}!`);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
              Join Martify
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Create Account
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Enjoy faster checkouts, order tracking, and exclusive discounts.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Password (min. 7 chars)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
                minLength={7}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition active:scale-[0.99] cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Right Hero Image */}
        <div className="hidden md:block w-1/2 relative bg-gray-900">
          <img
            src={registerImg}
            alt="Register for Martify"
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 text-white">
            <div>
              <p className="font-bold text-lg">Your Fashion Journey Begins</p>
              <p className="text-xs text-gray-300">Join thousands of stylish shoppers worldwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
