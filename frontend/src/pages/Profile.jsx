import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice.js";
import MyOrdersPage from "./MyOrdersPage.jsx";
import { FiUser, FiMail, FiShield, FiLogOut } from "react-icons/fi";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: User Profile Card */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6 sticky top-6">
              {/* Avatar circle */}
              <div className="flex flex-col items-center text-center pb-4 border-b">
                <div className="w-20 h-20 rounded-full bg-black text-white font-extrabold text-2xl flex items-center justify-center mb-3 shadow">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {user.name}
                </h2>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-800 mt-1">
                  {user.role || "Customer"}
                </span>
              </div>

              {/* Account details */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <FiUser className="text-gray-400 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-gray-400 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiShield className="text-gray-400 h-4 w-4 flex-shrink-0" />
                  <span className="capitalize">{user.role} Account</span>
                </div>
              </div>

              {/* Logout button */}
              <div className="pt-2 border-t">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 py-2.5 px-4 rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
