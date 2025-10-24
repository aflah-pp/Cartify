import React, { useEffect, useState } from "react";
import api, { BASE_URL } from "../utils/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiEdit2, FiTrash2, FiX, FiPlus, FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    total_sales: 0,
    earnings: 0,
    chart_data: [],
  });
  const [loading, setLoading] = useState(false);

  // Popup states
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Review popup state
  const [reviewProduct, setReviewProduct] = useState(null);

  // Form state for add/edit
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
    imagePreview: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [prodRes, dashRes] = await Promise.all([
        api.get("seller/products/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("seller/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProducts(prodRes.data);
      setDashboardData(dashRes.data);
    } catch (e) {
      alert("Error loading data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file),
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openPopup = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        category: product.category || "",
        image: null,
        imagePreview: product.image || "",
      });
    } else {
      setEditingProduct(null);
      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        image: null,
        imagePreview: "",
      });
    }
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    if (form.imagePreview && form.image) {
      URL.revokeObjectURL(form.imagePreview);
    }
    setIsPopupOpen(false);
  };

  const submitProduct = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingProduct) {
        await api.patch(
          `seller/products/${editingProduct.id}/update/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await api.post("seller/products/create/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      fetchData();
      closePopup();
    } catch (e) {
      alert("Failed to save product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`seller/products/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch {
      alert("Failed to delete product");
    }
  };

  // Open review popup
  const openReviewPopup = (product) => {
    setReviewProduct(product);
  };

  // Close review popup
  const closeReviewPopup = () => {
    setReviewProduct(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Back to Shop */}
      <button
        onClick={() => (window.location.href = "/shop")} // or use router if you have one
        className="inline-flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 font-semibold transition focus:outline-none"
      >
        <FiArrowLeft size={20} />
        Back to Shop
      </button>

      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Seller Dashboard
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-indigo-100 p-6 rounded shadow flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300 cursor-default">
          <p className="text-gray-700 uppercase tracking-wide font-medium">
            Total Sales
          </p>
          <p className="text-4xl font-extrabold text-indigo-900">
            {dashboardData.total_sales}
          </p>
        </div>
        <div className="bg-green-100 p-6 rounded shadow flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300 cursor-default">
          <p className="text-gray-700 uppercase tracking-wide font-medium">
            Total Earnings
          </p>
          <p className="text-4xl font-extrabold text-green-900">
            ${dashboardData.earnings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded shadow mb-8 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Quantity Sold Per Product
        </h3>
        {dashboardData.chart_data.length === 0 ? (
          <p className="text-gray-500">No sales data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={dashboardData.chart_data}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: "#4f46e5", fontWeight: "bold" }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Products List */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Your Products
          </h3>
          <button
            onClick={() => openPopup()}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <FiPlus size={20} />
            Add Product
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products yet. Add some!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-3 px-5 text-left">Image</th>
                  <th className="py-3 px-5 text-left">Name</th>
                  <th className="py-3 px-5 text-left">Price</th>
                  <th className="py-3 px-5 text-left">Category</th>
                  <th className="py-3 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50 transition cursor-pointer`}
                    onClick={() => openReviewPopup(product)} // open review on row click
                  >
                    <td className="py-3 px-5">
                      <img
                        src={`${BASE_URL}${product.image}`}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-5 font-medium text-gray-800">
                      {product.name}
                    </td>
                    <td className="py-3 px-5 text-gray-700">
                      ${product.price}
                    </td>
                    <td className="py-3 px-5 text-gray-600">
                      {product.category}
                    </td>
                    <td
                      className="py-3 px-5 flex justify-center gap-4"
                      onClick={(e) => e.stopPropagation()} // prevent opening review popup on button clicks
                    >
                      <button
                        onClick={() => openPopup(product)}
                        className="text-indigo-600 hover:text-indigo-800"
                        aria-label="Edit product"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete product"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Product Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
                aria-label="Close popup"
              >
                <FiX size={24} />
              </button>
              <h3 className="text-xl font-semibold mb-4">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitProduct();
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div>
                  <label
                    htmlFor="image"
                    className="block mb-1 font-medium cursor-pointer text-indigo-600 hover:text-indigo-800"
                  >
                    {form.imagePreview
                      ? "Change Image"
                      : "Upload Product Image"}
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  {form.imagePreview && (
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded shadow"
                    />
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition focus:outline-none"
                >
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Review Popup */}
      <AnimatePresence>
        {reviewProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeReviewPopup}
          >
            <motion.div
              className="bg-white rounded-lg max-w-xl w-full p-6 relative shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeReviewPopup}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Close review"
              >
                <FiX size={28} />
              </button>

              <img
                src={`${BASE_URL}${reviewProduct.image}`}
                alt={reviewProduct.name}
                className="w-full h-64 object-cover rounded mb-4"
              />
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                {reviewProduct.name}
              </h2>
              <p className="text-gray-700 mb-1 font-semibold">
                Price: ${reviewProduct.price}
              </p>
              <p className="text-gray-600 mb-2 italic">
                {reviewProduct.category}
              </p>
              <p className="text-gray-800 whitespace-pre-wrap">
                {reviewProduct.description || "No description provided."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerDashboard;
