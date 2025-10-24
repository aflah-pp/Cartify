import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import headsetAnimation from "../../assets/headset.json";

export default function HeaderPage() {
  return (
    <header className="relative h-[50vh] w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-400 to-indigo-300">
      {/* Background Lottie Animation - low opacity, centered */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <Player
          autoplay
          loop
          src={headsetAnimation}
          className="relative h-[50vh] w-full sm:w-[600px] sm:h-[600px] opacity-40"
        />
      </div>

      {/* Animated Text Block */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center px-6 py-6 bg-white/10 backdrop-blur-md rounded-xl shadow-xl max-w-3xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-md mb-4"
        >
          Welcome to Cartify
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto drop-shadow"
        >
          Discover the best products at the best prices. Whether you’re after
          gadgets, fashion, or home essentials — we got you.
        </motion.p>
      </motion.div>
    </header>
  );
}
