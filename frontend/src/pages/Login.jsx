import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import loginImg from "../assets/login1.avif";
import { loginUser, clearAuthError } from "../redux/slices/authSlice.js";
import { mergeCart, fetchCart } from "../redux/slices/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, guestId } = useSelector((state) => state.auth);
  const redirect = searchParams.get("redirect") || "/";

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
      navigate(redirect === "checkout" ? "/checkout" : user.role === "admin" ? "/admin" : "/");
    }
  }, [user, guestId, dispatch, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      toast.success(`Welcome back, ${result.name}!`);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Invalid email or password");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
              Martify Store
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Welcome Back
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Sign in to manage your orders, cart, and profile.
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
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 hover:text-black cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition active:scale-[0.99] cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-black hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Right Hero Image */}
        <div className="hidden md:block w-1/2 relative bg-gray-900">
          <img
            src={loginImg}
            alt="Martify Login"
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 text-white">
            <div>
              <p className="font-bold text-lg">Premium Fashion & Lifestyle</p>
              <p className="text-xs text-gray-300">Fast worldwide delivery with seamless returns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
