import React from "react";
import { motion } from "framer-motion";

function ProductPlaceHolder() {
  const shimmer = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200";

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className={`md:w-1/2 h-[400px] rounded-xl ${shimmer}`} />

        <div className="md:w-1/2 space-y-5">
          <div className={`h-10 w-3/4 rounded-lg ${shimmer}`} />
          <div className={`h-6 w-1/3 rounded-lg ${shimmer}`} />
          <div className={`h-20 w-full rounded-lg ${shimmer}`} />
          <div className={`h-12 w-1/2 rounded-lg mt-6 ${shimmer}`} />
        </div>
      </div>

      <div className="mt-20 space-y-4">
        <div className={`h-8 w-1/4 rounded-lg ${shimmer}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-xl bg-white shadow-md space-y-4"
            >
              <div className={`h-40 rounded ${shimmer}`} />
              <div className={`h-6 w-3/4 rounded ${shimmer}`} />
              <div className={`h-4 w-1/2 rounded ${shimmer}`} />
              <div className={`h-10 w-full rounded ${shimmer}`} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ProductPlaceHolder;
