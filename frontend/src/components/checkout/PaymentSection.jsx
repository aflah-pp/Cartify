import React from "react";
import { useNavigate } from "react-router";
import api from "../utils/axios";

function PaymentSection() {
  const navigate = useNavigate();

  function makePayment() {
    const cartCode = localStorage.getItem("cart_code");
    if (!cartCode) {
      console.log("No cart code found in localStorage");
      return;
    }

    api
      .post("initiate_payment", { cart_code: cartCode }) // <-- IMPORTANT
      .then((res) => {
        console.log("Payment initiated:", res.data);
        if (res.data.payment_link) {
          window.location.href = res.data.payment_link;
        }
      })
      .catch((err) => {
        console.log("Payment error:", err.response?.data || err.message);
      });
  }

  const goBack = () => {
    navigate("/cart");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Payment Methods
      </h2>
      <div className="space-y-4">
        <div
          onClick={makePayment}
          className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
        >
          <i className="fas fa-credit-card text-black-500 text-2xl"></i>
          <span className="text-lg font-semibold text-gray-900">Pay</span>
        </div>
      </div>

      {/* Go Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={goBack}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default PaymentSection;
