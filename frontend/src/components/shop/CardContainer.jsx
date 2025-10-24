import React, { useState, useMemo, useEffect } from "react";
import HomeCard from "./HomeCard";

export default function CardContainer({ products }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Categories dropdown
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(unique)];
  }, [products]);

  // Get min/max price from products
  const [minPrice, maxPrice] = useMemo(() => {
    if (!products.length) return [0, 1000];
    const prices = products.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [products, selectedCategory, searchQuery, priceRange]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Browse Products</h1>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Price Range */}
          <div className="w-full md:w-1/3">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step="1"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], +e.target.value])
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleProducts.map((product) => (
          <HomeCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More */}
      {visibleCount < filteredProducts.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
