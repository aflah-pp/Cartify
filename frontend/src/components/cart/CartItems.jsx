import { useState } from 'react'
import api, { BASE_URL } from '../utils/axios'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'

const buttonBaseStyles =
  'w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-50'

function CartItems({ item, setNumCartItems, setCartItems }) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [loading, setLoading] = useState(false)

  const updateQuantity = newQuantity => {
    if (newQuantity < 1) return
    setLoading(true)
    api
      .patch('update_quantity/', {
        item_id: item.id,
        quantity: newQuantity,
      })
      .then(() => {
        setLoading(false)
        setQuantity(newQuantity)
        setNumCartItems(prev => prev + (newQuantity - item.quantity))
        toast.success('Cart updated successfully!')
      })
      .catch(err => {
        setLoading(false)
        console.error('Failed to update quantity', err.message)
        toast.error(err.message || 'Failed to update cart')
      })
  }

  const deleteCartItem = () => {
    if (window.confirm('Are you sure to delete item from cart?')) {
      setLoading(true)
      api
        .delete('delete_cartitem/', { data: { item_id: item.id } })
        .then(() => {
          setLoading(false)
          setCartItems(prev => prev.filter(cartItem => cartItem.id !== item.id))
          setNumCartItems(prev => prev - quantity)
          toast.success('Item removed from cart')
        })
        .catch(err => {
          setLoading(false)
          console.error(err.message)
          toast.error(err.message || 'Failed to remove item')
        })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      className="flex items-start bg-white border-b border-gray-100 py-6 px-4 mb-4 hover:bg-gray-50 transition-colors duration-200"
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-32 h-32 mr-6">
        <img
          src={`${item.product.image}`}
          alt={item.product.name}
          className="w-full h-full object-contain rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {item.product.name}
        </h3>

        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-6">
            <p className="text-lg text-gray-900">${item.product.price}</p>

            <div className="flex items-center space-x-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(quantity - 1)}
                disabled={loading || quantity <= 1}
                className={`${buttonBaseStyles} bg-gray-100 text-gray-700 hover:bg-gray-200`}
              >
                <FiMinus size={20} />
              </motion.button>

              <input
                type="number"
                value={quantity}
                readOnly
                className="w-16 text-center text-base font-medium border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                min={1}
                disabled={loading}
              />

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(quantity + 1)}
                disabled={loading}
                className={`${buttonBaseStyles} bg-gray-100 text-gray-700 hover:bg-gray-200`}
              >
                <FiPlus size={20} />
              </motion.button>
            </div>
          </div>

          <div className="flex space-x-5 items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateQuantity(quantity)}
              disabled={loading}
              className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Cart'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={deleteCartItem}
              disabled={loading}
              className="bg-red-400 text-white hover:bg-red-500 py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              <FiTrash2 size={18} />
              <span>Remove</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItems
