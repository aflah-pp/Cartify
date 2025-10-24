import { useState, useEffect } from "react";
import api from "../utils/axios"; // Import your API utility

function useCardData() {
  const [cartItems, setCartItems] = useState([]);  // State for storing the cart items
  const [loading, setLoading] = useState(true);    // State to track loading status
  const [error, setError] = useState(null);        // State for storing errors
  const [sumTotal, setSumTotal] = useState(0);     // State for the total sum
  const tax = 0.03;                             // Tax rate constant
  const taxRate = parseFloat(tax)
  const cart_code = localStorage.getItem("cart_code"); // Getting cart code from local storage

  useEffect(() => {
    if (!cart_code) {
      setError("No cart code found.");
      setLoading(false);
      return;
    }

    setLoading(true); // Start loading when API call is made
    api
      .get(`get_cart?cart_code=${cart_code}`)
      .then((res) => {
        setCartItems(res.data.items || []); // Set the cart items from the response
        setSumTotal(res.data.sum_total || 0); // Set the total sum
        setLoading(false); // Stop loading when the data is fetched
      })
      .catch((err) => {
        setError("Failed to load cart. Please try again.");
        setLoading(false); // Stop loading in case of error
      });
  }, [cart_code]); // Dependency on cart_code to re-run the effect if cart_code changes

  return {
    cartItems,
    setCartItems,
    loading,
    error,
    sumTotal,
    setSumTotal,
    taxRate,
  };
}

export default useCardData;  // Default export to use the hook elsewhere
