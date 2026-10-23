import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      {/* Mobile Top Header */}
      <div className="flex md:hidden items-center justify-between p-4 bg-gray-900 text-white z-30 shadow">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            <FaBars size={22} />
          </button>
          <Link to="/admin" className="ml-3 text-lg font-bold tracking-tight">
            Martify Admin
          </Link>
        </div>
        <Link
          to="/"
          className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700"
        >
          View Store &rarr;
        </Link>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar (Desktop and Mobile Drawer) */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-950 text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 z-50 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
