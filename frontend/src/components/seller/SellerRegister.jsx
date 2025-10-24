import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { Store, FileText, Loader2, ShieldCheck } from "lucide-react";

function SellerRegister() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shop_name: "",
    tax_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError("You must be logged in to upgrade");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("user/upgrade_to_seller/", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/seller/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Failed to register seller");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-2xl shadow-2xl border border-yellow-400">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <ShieldCheck className="text-yellow-500" size={28} />
          Become a Verified Seller
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Unlock exclusive tools to manage your products, track sales, and grow your brand.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
            <Store className="text-yellow-500" size={20} />
            Shop Name
          </label>
          <input
            type="text"
            name="shop_name"
            value={formData.shop_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g. Trendy Treasures"
          />
          <p className="text-xs text-gray-500 mt-1 ml-1">Your brand name shown to customers.</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
            <FileText className="text-yellow-500" size={20} />
            Tax Number
          </label>
          <input
            type="text"
            name="tax_number"
            value={formData.tax_number}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g. 1234567890"
          />
          <p className="text-xs text-gray-500 mt-1 ml-1">Used for legal verification and payouts.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Registering...
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              Upgrade to Seller
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t pt-4 text-sm text-gray-500 text-center">
        You can access your Seller Dashboard after approval.
      </div>
    </div>
  );
}

export default SellerRegister;
