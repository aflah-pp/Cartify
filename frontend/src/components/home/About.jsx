import React from "react";
import Navbar from "../ui/NavBar";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function AboutPage({ numCartItems }) {
  return (
    <>
      <Navbar numCartItems={numCartItems} />
      <div className="bg-white text-gray-800 min-h-screen py-16 px-6 sm:px-12">
        <motion.div
          className="max-w-5xl mx-auto space-y-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* About Section */}
          <section>
            <h1 className="text-4xl font-bold text-sky-600 mb-4">
              About Cartify
            </h1>
            <p className="text-lg leading-relaxed">
              Welcome to{" "}
              <span className="text-sky-600 font-semibold">Cartify</span> — your
              one-stop destination for cutting-edge electrical gadgets and tech
              essentials. Whether you’re hunting for the latest smart
              accessories, power tools, or daily-use electronics, Cartify
              delivers high quality at prices that won’t fry your wallet.
              <br />
              <br />
              Founded by a team of gadget geeks, Cartify aims to make online
              tech shopping simple, fun, and fast. From doorstep delivery within
              24 hours to 24/7 support, we’re here to electrify your experience
              — literally.
            </p>
          </section>

          {/* Terms & Policy Section */}
          <section>
            <h2 className="text-3xl font-bold text-sky-600 mb-4">
              Terms & Policy
            </h2>
            <p className="leading-relaxed">
              By using Cartify, you agree to our terms of service which include
              responsible use of the platform, truthful information during
              checkout, and respecting our return/refund guidelines.
              <br />
              <br />
              All purchases are subject to product availability. We reserve the
              right to cancel any order due to pricing errors or suspected
              fraud. Your data is protected under our strict privacy policy and
              will never be shared with third parties without consent.
              <br />
              <br />
              If you have any concerns, our support ninjas are on call 24/7.
            </p>
          </section>

          {/* Contact Info Section */}
          <section>
            <h2 className="text-3xl font-bold text-sky-600 mb-4">Get in Touch</h2>
            <p className="flex flex-col gap-2">
              <span className="flex items-center gap-2">
                <FiMail className="text-sky-600" /> 
                <a
                  href="mailto:support@cartify.com"
                  className="text-sky-600 underline hover:text-sky-800"
                >
                  support@cartify.com
                </a>
              </span>
              <span className="flex items-center gap-2">
                <FiPhone className="text-sky-600" /> +91-0000-0000
              </span>
              <span className="flex items-center gap-2">
                <FiMapPin className="text-sky-600" /> Kerala, India
              </span>
            </p>
          </section>
        </motion.div>
      </div>
    </>
  );
}
