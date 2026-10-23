import React, { useState } from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/api/subscribers`, { email });
      toast.success(res.data.message || "Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to subscribe. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t bg-gray-50/50 py-12 mt-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 lg:px-8">
        {/* Newsletter Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Newsletter</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Be the first to hear about new products, exclusive events, and online offers.
          </p>
          <p className="font-semibold text-sm text-gray-800">
            Sign up and get 10% off on your first order.
          </p>

          {/* Newsletter form */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 p-3 text-sm border border-gray-300 rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-black bg-white"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-black text-white px-5 py-3 text-sm font-semibold rounded-md sm:rounded-l-none hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {submitting ? "Joining..." : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Shop links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Shop Collections</h3>
          <ul className="space-y-2.5 text-gray-600">
            <li>
              <Link
                to="/collections/all?gender=Men"
                className="text-sm hover:text-black transition-colors"
              >
                Men's Fashion
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?gender=Women"
                className="text-sm hover:text-black transition-colors"
              >
                Women's Fashion
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?category=Top Wear"
                className="text-sm hover:text-black transition-colors"
              >
                Top Wear & Shirts
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?category=Bottom Wear"
                className="text-sm hover:text-black transition-colors"
              >
                Bottom Wear & Trousers
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all"
                className="text-sm hover:text-black transition-colors"
              >
                All Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Policies */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Customer Support</h3>
          <ul className="space-y-2.5 text-gray-600">
            <li>
              <Link to="/profile" className="text-sm hover:text-black transition-colors">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="text-sm hover:text-black transition-colors">
                Order Tracking
              </Link>
            </li>
            <li>
              <span className="text-sm text-gray-500">Shipping Policy (Worldwide)</span>
            </li>
            <li>
              <span className="text-sm text-gray-500">30-Day Easy Returns</span>
            </li>
            <li>
              <span className="text-sm text-gray-500">Privacy & Terms</span>
            </li>
          </ul>
        </div>

        {/* Contact info & socials */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Get in Touch</h3>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <FiPhoneCall className="text-gray-800" />
              <span>+1 (234) 567-980</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-gray-800" />
              <span>support@martify.com</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMapPin className="text-gray-800" />
              <span>Worldwide Shipping Center</span>
            </li>
          </ul>

          <div className="pt-2 flex items-center space-x-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-800 transition"
              aria-label="Facebook"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-800 transition"
              aria-label="Instagram"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-800 transition"
              aria-label="Twitter"
            >
              <RiTwitterXLine className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t mt-12 pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Martify E-Commerce. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
