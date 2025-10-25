import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiShoppingCart } from 'react-icons/fi'
import api, { BASE_URL } from '../utils/axios'
import Navbar from '../ui/NavBar'
import ProductPlaceHolder from './ProductPlaceHolder'
import RelatedProducts from './RelatedProducts'
import Error from '../ui/Error'
import { toast } from 'react-toastify'

function Product({ numCartItems, setNumCartItems }) {
  const { slug } = useParams()
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(false)
  const [similarProduct, setSimilarProduct] = useState([])
  const [error, setError] = useState('')
  const [inCart, setInCart] = useState(false)
  const cart_code = localStorage.getItem('cart_code')
  const newItem = { cart_code: cart_code, product_id: product.id }

  useEffect(() => {
    setLoading(true)
    api
      .get(`products_detail/${slug}`)
      .then(res => {
        setProduct(res.data)
        setSimilarProduct(res.data.similar_product || [])
        setLoading(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
      .catch(err => {
        console.log(err.message)
        setLoading(false)
        setError(err.message)
      })
  }, [slug])

  useEffect(() => {
    if (!cart_code || !product?.id) return
    api
      .get(`product_in_cart?cart_code=${cart_code}&product_id=${product.id}`)
      .then(res => {
        setInCart(res.data.product_in_cart)
      })
      .catch(err => console.log(err.message))
  }, [cart_code, product.id])

  function addItem() {
    api
      .post('add_item', newItem)
      .then(() => {
        setInCart(true)
        setNumCartItems(numCartItems + 1)
        toast.success('Product added to Cart.')
      })
      .catch(err => console.log(err.message))
  }

  if (loading) return <ProductPlaceHolder />
  if (error) return <Error error={error} />

  return (
    <>
      <Navbar numCartItems={numCartItems} setNumCartItems={setNumCartItems} />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        {/* Product Display */}
        <div className="flex flex-col md:flex-row gap-10 bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
          {/* Image */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="md:w-1/2 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden"
          >
            <img
              src={`${product.cover_image_url}`}
              alt={product?.name || 'Product'}
              className="w-full max-h-[500px] object-contain"
            />
          </motion.div>

          {/* Details */}
          <div className="md:w-1/2 flex flex-col justify-between text-sm space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-2">
                {product.name}
              </h1>

              <p className="text-xl text-blue-600 font-bold mb-1">
                ${product.price}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Inclusive of all taxes
              </p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 border-l-4 border-blue-500 px-4 py-3 rounded-md shadow-sm max-h-60 overflow-y-auto"
              >
                <p className="text-gray-700 leading-relaxed tracking-normal font-normal text-base whitespace-pre-wrap">
                  {product.description}
                </p>
              </motion.div>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addItem}
                disabled={inCart}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow hover:shadow-md transition-all duration-300 ${
                  inCart && 'bg-green-600 hover:bg-green-700 cursor-default'
                }`}
              >
                {inCart ? (
                  <>
                    <FiCheckCircle size={18} /> Added to Cart
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 pb-2 border-b-2 border-gray-200">
            You Might Also Like
          </h2>
          <RelatedProducts products={similarProduct} />
        </div>
      </motion.div>
    </>
  )
}

export default Product
