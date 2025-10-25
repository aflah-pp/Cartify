import React from 'react'
import { BASE_URL } from '../utils/axios'

function OrderItem({ cartItem }) {
  const { product, quantity } = cartItem

  return (
    <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-md border mb-3">
      {/* Product Info */}
      <div className="flex items-center gap-6">
        <img
          src={`${product.image}`}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md border"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Quantity: {quantity}</p>
        </div>
      </div>

      {/* Price Info */}
      <div className="text-right">
        {/* Price per item */}
        <p className="text-sm text-gray-700 font-medium mb-1">
          ${product.price} x {quantity}
        </p>

        {/* Total Price */}
        <p className="text-xl font-semibold text-gray-900">
          ${(product.price * quantity).toFixed(0)}
        </p>
      </div>
    </div>
  )
}

export default OrderItem
