import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router'
import { BASE_URL } from '../utils/axios'

function HomeCard({ product }) {
  const navigate = useNavigate()

  const handleNav = () => {
    navigate(`/product/${product.slug}`)
  }
  return (
    <div
      className="relative flex flex-col h-full border border-gray-200 rounded-2xl shadow-md bg-white p-5
        transition-transform duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03]"
    >
      <Link to={`/product/${product.slug}`} className="flex flex-col grow">
        <div className="relative w-full h-52 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-50 to-blue-100 mb-4 flex items-center justify-center">
          <img
            src={`${product.cover_image_url}`}
            alt={product?.name || 'Product Name'}
            className="object-contain max-h-full max-w-full transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>

        <p
          className="text-lg font-semibold text-gray-900 truncate"
          title={product?.name}
        >
          {product?.name || 'Product Name'}
        </p>

        <p className="mt-1 text-blue-700 font-extrabold text-xl">
          $ {product?.price || '0.00'}
        </p>
      </Link>

      <button
        onClick={handleNav}
        className="mt-6 flex items-center justify-center gap-3 bg-blue-600 text-white py-3 rounded-2xl font-semibold
          shadow-md hover:bg-blue-700 active:scale-95 transition-transform duration-150"
        aria-label={`Buy ${product?.name}`}
      >
        <FaShoppingCart size={20} />
        Buy It
      </button>
    </div>
  )
}

export default HomeCard
