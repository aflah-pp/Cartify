import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function CartSummary({ sumTotal, numOfItems }) {
  const taxRate = 0.03;
  const taxAmount = sumTotal * taxRate;
  const totalPrice = sumTotal + taxAmount;

  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <p className="text-gray-600">Items ({numOfItems}):</p>
          <p className="font-medium text-gray-900">${sumTotal.toFixed(0)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Tax (6%):</p>
          <p className="font-medium text-gray-900">${taxAmount.toFixed(0)}</p>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <p className="text-gray-900 font-semibold">Total:</p>
          <p className="font-semibold text-gray-900">${totalPrice.toFixed(0)}</p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/checkout")}
        className="w-full py-3 mt-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-all"
      >
        Proceed to Checkout
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/shop")}
        className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all"
      >
        Go Back to Shop
      </motion.button>
    </div>
  );
}

export default CartSummary;
