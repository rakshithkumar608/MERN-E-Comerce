import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  deleteProduct,
} from "../../redux/slices/adminProductSlice.js";
import { toast } from "sonner";
import { FiPlus, FiEdit2, FiTrash2, FiBox } from "react-icons/fi";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error(typeof err === "string" ? err : "Failed to delete product");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your store's items, pricing, inventory, and categories
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition flex items-center gap-2 shadow"
        >
          <FiPlus className="text-base" />
          <span>Add New Product</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700 border-b">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products && products.length > 0 ? (
                products.map((product) => {
                  const img =
                    product.images?.[0]?.url ||
                    product.image ||
                    "https://picsum.photos/100?random=1";

                  return (
                    <tr key={product._id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={product.name}
                            className="w-12 h-14 object-cover object-top rounded-lg border border-gray-100 flex-shrink-0"
                          />
                          <div className="max-w-xs">
                            <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                              {product.name}
                            </h3>
                            <p className="text-[11px] text-gray-400">
                              {product.brand || "Martify"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs font-medium text-gray-700 whitespace-nowrap">
                        {product.category || "General"}
                      </td>

                      <td className="py-3 px-4 text-xs font-extrabold text-gray-900 whitespace-nowrap">
                        ₹{Number(product.price).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            product.countInStock > 5
                              ? "bg-emerald-50 text-emerald-700"
                              : product.countInStock > 0
                              ? "bg-yellow-50 text-yellow-800"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {product.countInStock} in stock
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                        {product.sku}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Product"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Product"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <FiBox className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-semibold">No products found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click "+ Add New Product" above to create one.
                    </p>
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

export default ProductManagement;
