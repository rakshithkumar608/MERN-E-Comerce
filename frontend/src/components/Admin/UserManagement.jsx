import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../redux/slices/adminSlice.js";
import { toast } from "sonner";
import { FiUserPlus, FiTrash2, FiUsers } from "react-icons/fi";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const currentAuthUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all user fields");
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(addUser(formData)).unwrap();
      toast.success("New user created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "customer",
      });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUser({ id: userId, role: newRole })).unwrap();
      toast.success("User role updated successfully");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (userId === currentAuthUser?._id) {
      toast.error("You cannot delete your own admin account");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(typeof err === "string" ? err : "Failed to delete user");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            User Accounts Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer accounts, permissions, and administrator access
          </p>
        </div>
        <span className="text-xs font-bold bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
          {users?.length || 0} Total Users
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Add new user form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiUserPlus className="text-gray-500" />
          <span>Add New User / Admin</span>
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Connor"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah@example.com"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Account Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="customer">Customer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white p-2.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-gray-800 transition active:scale-[0.99] cursor-pointer shadow disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700 border-b">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users && users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center">
                          {u.name ? u.name[0].toUpperCase() : "U"}
                        </div>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                          {u.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-600">{u.email}</td>

                    <td className="py-3.5 px-4">
                      <select
                        value={u.role || "customer"}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === currentAuthUser?._id}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-800 border-purple-300"
                            : "bg-gray-50 text-gray-800 border-gray-300"
                        }`}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        disabled={u._id === currentAuthUser?._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 cursor-pointer"
                        title={
                          u._id === currentAuthUser?._id
                            ? "Cannot delete your own account"
                            : "Delete User"
                        }
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <FiUsers className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-semibold">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
