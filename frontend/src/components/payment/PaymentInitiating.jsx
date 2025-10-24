import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaCreditCard,
  FaLock,
  FaPercentage,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/axios";

function PaymentInitiating() {
  const [params] = useSearchParams();
  const order_id = params.get("order_id");
  const baseAmount = parseFloat(params.get("amount"));
  const [amount, setAmount] = useState(baseAmount);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Auto-format card number: only digits, start with '453', add '-' every 4 digits
  const formatCardNumber = (value) => {
    // Strip all non-digits
    let digits = value.replace(/\D/g, "");
    // Force start with 453 (Visa prefix)
    if (!digits.startsWith("453")) digits = "453" + digits.slice(3);
    // Limit max length to 16 digits
    digits = digits.slice(0, 16);
    // Insert '-' every 4 digits
    return digits.replace(/(.{4})/g, "$1-").replace(/-$/, "");
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  // Auto-format expiry MM/YY (insert '/' after 2 digits)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4); // max 4 digits
    if (val.length >= 3) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setExpiry(val);
  };

  // Only digits for CVV, max 4
  const handleCvvChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(digits);
  };

  const applyDiscount = () => {
    if (discountApplied) {
      setError("Discount already applied.");
    } else if (discountCode.trim().toUpperCase() === "SAVE10") {
      setAmount((prev) => Math.max(prev - 10, 0).toFixed(2));
      setDiscountApplied(true);
      setError("");
    } else {
      setError("Invalid discount code.");
    }
  };

  // Shake animation for error messages
  const errorVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: {
      opacity: 1,
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };

  const handlePayNow = () => {
    // Strip dashes before validation
    const rawCardNumber = cardNumber.replace(/-/g, "");
    if (!/^453\d{13}$/.test(rawCardNumber)) {
      setError("Card number must be 16 digits and start with 453.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setError("Expiry must be in MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV must be 3 or 4 digits.");
      return;
    }

    setIsProcessing(true);
    setError("");

    api
      .post("http://127.0.0.1:8000/payment_status", {
        order_id: order_id,
        status: "success",
      })
      .then((res) => {
        if (res.data.redirect_url) {
          window.location.href = res.data.redirect_url;
        }
        setIsProcessing(false);
      })
      .catch((error) => {
        console.error("Payment status update failed:", error);
        setError("Failed to process payment. Please try again.");
        setIsProcessing(false);
      });
  };

  // Detect if Visa icon should show
  const showVisaIcon = cardNumber.replace(/-/g, "").startsWith("453");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Complete Your Payment
        </h2>

        <div className="bg-blue-600 text-white rounded-xl px-6 py-4 mb-6 shadow">
          <p className="text-sm">
            Order ID: <strong>{order_id}</strong>
          </p>
          <p className="text-lg font-bold mt-2">Amount: ${amount}</p>
        </div>

        <div className="space-y-4">
          {/* Card Number */}
          <div className="relative">
            <FaCreditCard className="absolute left-3 top-3 text-gray-400" />
            {showVisaIcon && (
              <motion.img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt="Visa"
                className="absolute right-3 top-2 w-10 h-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              />
            )}
            <input
              type="text"
              placeholder="Card Number (starts with 453)"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19} // 16 digits + 3 dashes
              className="w-full pl-10 bg-gray-100 px-4 py-3 rounded outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Expiry and CVV */}
          <div className="flex gap-4">
            <div className="relative w-1/2">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                maxLength={5}
                onChange={handleExpiryChange}
                className="pl-10 bg-gray-100 px-4 py-3 rounded w-full outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="relative w-1/2">
              <FaShieldAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                maxLength={4}
                onChange={handleCvvChange}
                className="pl-10 bg-gray-100 px-4 py-3 rounded w-full outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Discount Code */}
          <div className="flex gap-2 items-center">
            <FaPercentage className="text-gray-500" />
            <input
              type="text"
              placeholder="Discount Code"
              className="bg-gray-100 px-4 py-2 rounded w-full outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={discountApplied}
            />
            <button
              onClick={applyDiscount}
              disabled={discountApplied}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
              Apply
            </button>
          </div>

          {/* Error Display with shake */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-600 text-sm mt-2"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Pay Now */}
          <motion.button
            onClick={handlePayNow}
            disabled={isProcessing}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: isProcessing ? 1 : 1.05 }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : `Pay $${amount}`}
          </motion.button>
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center flex items-center justify-center gap-2">
          <FaLock /> Secured by Cartify
        </p>
      </motion.div>
    </div>
  );
}

export default PaymentInitiating;
