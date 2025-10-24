import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { getOrCreateCartCode } from "../utils/codeGenerator";

function PaymentStatus() {
  const [params] = useSearchParams();
  const status = params.get("status");
  const orderId = params.get("order_id");
  const isSuccess = status === "success";

  useEffect(() => {
    if (isSuccess) {
      localStorage.removeItem("cart_code");

      const newCode = getOrCreateCartCode(); // Call inside effect
      localStorage.setItem("cart_code", newCode);
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full"
      >
        {isSuccess ? (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-700 mb-6">
              Order ID: <strong>{orderId}</strong>
            </p>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-red-500 text-5xl mb-4 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-700 mb-6">
              Order ID: <strong>{orderId}</strong>
            </p>
          </>
        )}
        <a
          href="/shop"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Back to Shopping
        </a>
      </motion.div>
    </div>
  );
}

export default PaymentStatus;
