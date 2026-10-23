import React from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaChartPie,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js";

const AdminSidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    if (onNavigate) onNavigate();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `flex items-center space-x-3 py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
      isActive
        ? "bg-emerald-600 text-white shadow-sm"
        : "text-gray-400 hover:bg-gray-900 hover:text-white"
    }`;

  return (
    <div className="flex flex-col h-full p-6 justify-between">
      <div>
        {/* Brand header */}
        <div className="pb-6 mb-6 border-b border-gray-800">
          <Link
            to="/admin"
            onClick={onNavigate}
            className="text-2xl font-extrabold tracking-tight text-white block"
          >
            MARTIFY
          </Link>
          <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold">
            Admin Panel
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col space-y-2">
          <NavLink to="/admin" end className={navClass} onClick={onNavigate}>
            <FaChartPie className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/orders" className={navClass} onClick={onNavigate}>
            <FaClipboardList className="h-4 w-4" />
            <span>Orders</span>
          </NavLink>

          <NavLink to="/admin/products" className={navClass} onClick={onNavigate}>
            <FaBoxOpen className="h-4 w-4" />
            <span>Products</span>
          </NavLink>

          <NavLink to="/admin/users" className={navClass} onClick={onNavigate}>
            <FiUser className="h-4 w-4" />
            <span>Users</span>
          </NavLink>

          <div className="pt-4 border-t border-gray-800/80 my-2"></div>

          <NavLink to="/" className={navClass} onClick={onNavigate}>
            <FaStore className="h-4 w-4" />
            <span>Customer Store</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-900/50 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm font-bold transition cursor-pointer"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
