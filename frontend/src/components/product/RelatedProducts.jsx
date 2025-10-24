import React from "react";
import { motion } from "framer-motion";
import HomeCard from "../shop/HomeCard";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

function RelatedProducts({ products = [] }) {
  if (!products.length) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product?.id} variants={itemVariants}>
          <HomeCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default RelatedProducts;
