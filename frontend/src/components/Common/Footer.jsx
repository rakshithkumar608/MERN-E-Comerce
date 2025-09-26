import React from 'react'
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { TbBrandMeta } from 'react-icons/tb';
import { Link } from 'react-router-dom'
import { FiPhoneCall} from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Be the first to hear about new products, exclusive events, and
            online offers.
          </p>
          <p className="font-medium text-sm text-gray-700 mb-4">
            Sign up and get 10% off on your first order.
          </p>

          {/* Newsletter form */}
          <form className="flex flex-col sm:flex-row gap-2 mt-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-3 text-sm border border-gray-300 rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all  mt-4"
              required
            />
          <button
  type="submit"
  className="mt-4 bg-black text-white px-6 py-3 text-sm rounded-md sm:rounded-l-none hover:bg-gray-800 transition-all whitespace-nowrap"
>
  Subscribe
</button>

          </form>
        </div>

        {/* Shop links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-3 text-gray-600">
            <li>
              <Link to="#" className="text-sm hover:text-gray-800 transition-colors">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="text-sm hover:text-gray-800 transition-colors">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="text-sm hover:text-gray-800 transition-colors">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="text-sm hover:text-gray-800 transition-colors">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Support links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
          <ul className="space-y-3 text-gray-600">
            <li>
              <Link to="#" className="text-sm hover:text-gray-800 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="text-sm hover:text-gray-800 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="text-sm hover:text-gray-800 transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="text-sm hover:text-gray-800 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow us */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
          
          {/* Social Media Icons */}
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-800 transition-colors"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RiTwitterXLine className="h-5 w-5" />
            </a>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-800">Call Us</p>
            <p className="text-sm text-gray-600 flex items-center">
              <FiPhoneCall className="inline-block mr-2 h-4 w-4" />
              0123-456-789
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-8 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm text-center">
          © 2025, CompileTab. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;