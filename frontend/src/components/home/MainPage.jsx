import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Player } from "@lottiefiles/react-lottie-player";
import headsetAnimation from "../../assets/headset.json";
import { motion } from "framer-motion";
import { FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";

// Wrap Link with motion
const MotionLink = motion(Link);
const MotionButton = motion.button;

// Example button animation variants
const buttonAnim = {
  rest: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
  hover: { scale: 1.05, boxShadow: "0px 8px 15px rgba(0,0,0,0.2)" },
  tap: { scale: 0.95 },
};

function Main() {
  const { isAuthorized } = useContext(AuthContext);
  const nav = useNavigate();

 const handleLogout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  nav(0);  // This reloads the page
};


  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col justify-center items-center text-center px-4"
      >
        <Player
          autoplay
          loop
          src={headsetAnimation}
          className="w-64 h-64 sm:w-96 sm:h-96"
        />
        <h1 className="text-4xl sm:text-6xl font-extrabold text-blue-600 mt-4">
          Welcome to Cartify
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mt-2 max-w-xl">
          Your plug for top-tier electrical gadgets. Clean. Fast. Affordable.
        </p>

        {/* Primary Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <MotionLink
            to="/shop"
            variants={buttonAnim}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl"
          >
            Shop Now
          </MotionLink>
          <MotionLink
            to="/about"
            variants={buttonAnim}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="border-2 border-blue-600 text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white"
          >
            About Us
          </MotionLink>
        </div>
      </motion.div>

      {/* Secondary Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="pb-12 pt-8 px-4 w-full max-w-2xl mx-auto"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Auth Actions */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {isAuthorized ? (
              <MotionButton
                onClick={handleLogout}
                variants={buttonAnim}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="flex items-center gap-2 px-6 py-2 text-gray-700 hover:text-red-600 font-medium border border-gray-300 rounded-lg hover:border-red-200 hover:bg-red-50"
              >
                <FiLogOut size={20} />
                Sign Out
              </MotionButton>
            ) : (
              <>
                <MotionLink
                  to="/login"
                  variants={buttonAnim}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center gap-2 px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 hover:text-blue-800 font-medium"
                >
                  <FiLogIn size={20} />
                  Login
                </MotionLink>
                <MotionLink
                  to="/register"
                  variants={buttonAnim}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg"
                >
                  <FiUserPlus size={20} />
                  Create Account
                </MotionLink>
              </>
            )}
          </div>

          {/* Branding */}
          <div className="pt-4 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Cartify. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Main;
