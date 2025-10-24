import React from "react";
import OrderItem from "./OrderItem";

function OrderSummary({ cartItems, sumTotal, taxRate }) {
  const taxAmount = (sumTotal * taxRate).toFixed(2);
  const total = (parseFloat(sumTotal) + parseFloat(taxAmount)).toFixed(2);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>

      <div className="space-y-4">
        {cartItems.map((cartItem) => (
          <OrderItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </div>

      <div className="text-right mt-4 space-y-1 text-sm text-gray-700">
        <p>Subtotal: ${sumTotal.toFixed(0)}</p>
        <p>Tax (3%): ${(taxAmount)}</p>
        <p className="font-bold text-lg text-gray-900">
          Total: ${Number(total).toFixed(0)}
        </p>
      </div>
    </div>
  );
}

export default OrderSummary;
