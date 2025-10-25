import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api, { BASE_URL } from '../utils/axios'
import { FormateDate } from '../utils/formatDate'

function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    api.get('user_order_history').then(res => {
      setOrders(res.data.orders)
    })
  }, [])

  // Animations variants for list items
  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Modal animation variants
  const modalBackdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalContent = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">Your Orders</h2>

      {/* Scrollable Order List */}
      <motion.ul
        initial="hidden"
        animate="visible"
        className={`space-y-4 pr-1 ${
          orders.length > 3
            ? 'max-h-[220px] overflow-y-auto scroll-smooth scrollbar-hide'
            : ''
        }`}
      >
        {orders.map((order, index) => (
          <motion.li
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow transition cursor-pointer list-none"
            onClick={() => setSelectedOrder(order)}
            variants={listItemVariants}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-600 hover:underline">
                Order ID: {order.order_id}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Date: {FormateDate(order.order_date)}
            </p>
            <p className="text-sm text-gray-500">
              Transaction ID: {order.transaction_id}
            </p>
          </motion.li>
        ))}
      </motion.ul>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalBackdrop}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto"
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold"
              >
                &times;
              </button>

              <h3 className="text-lg font-bold mb-1">
                Order #{selectedOrder.order_id}
              </h3>
              <p className="text-sm text-gray-600">
                Transaction: {selectedOrder.transaction_id}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Ordered on: {FormateDate(selectedOrder.order_date)}
              </p>

              <div className="space-y-4">
                {selectedOrder.items.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-4 border rounded p-3 items-center"
                  >
                    <img
                      src={`${item.product_image}`}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t flex justify-end">
                <p className="text-lg font-bold text-gray-800">
                  Total: $
                  {selectedOrder.items
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrderHistory
