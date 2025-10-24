import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import Navbar from "../ui/NavBar";
import Spinner from "../ui/Spinner";
import Error from "../ui/Error";
import { AnimatePresence, motion } from "framer-motion";

function CartPage({ numCartItems, setNumCartItems }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sumTotal, setSumTotal] = useState(0);

  useEffect(() => {
    const cart_code = localStorage.getItem("cart_code");
    if (cart_code) {
      setLoading(true);
      api
        .get(`get_cart?cart_code=${cart_code}`)
        .then((res) => {
          setCartItems(res.data.items || []);
          setSumTotal(res.data.sum_total || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching cart:", err);
          setLoading(false);
          setError(err.message || "An error occurred");
        });
    } else {
      setLoading(false);
      setError("No cart code found.");
    }
  }, [numCartItems]);

  if (loading) return <Spinner loading={loading} />;
  if (error) return <Error error={error} />;

  return (
    <>
      <Navbar numCartItems={numCartItems} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItems
                    key={item.id}
                    item={item}
                    setNumCartItems={setNumCartItems}
                    setCartItems={setCartItems}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 space-y-4 text-center text-gray-600"
              >
                <svg
                  className="w-24 h-24 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.837L5.61 6.75M5.61 6.75h13.53l-1.395 6.279a1.125 1.125 0 01-1.096.846H7.28a1.125 1.125 0 01-1.096-.846L5.61 6.75zm0 0L4.723 4.089A1.125 1.125 0 003.682 3.75H2.25M7.5 21a.75.75 0 100-1.5.75.75 0 000 1.5zm9 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  />
                </svg>
                <p className="text-red-500 font-semibold text-lg">Your cart is empty!</p>
                <p className="text-sm text-gray-500">Add items to proceed to checkout.</p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition"
                >
                  Return to Shop
                </Link>
              </motion.div>
            )}
          </div>
          <div className="lg:col-span-1">
            {cartItems.length > 0 && (
              <CartSummary sumTotal={sumTotal} numOfItems={numCartItems} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;
