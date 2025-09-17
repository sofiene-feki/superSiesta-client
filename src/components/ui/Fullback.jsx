import React from "react";
import { motion } from "motion/react";
import logo from "../../assets/logo_supersiesta.png";

export default function FullBack() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col items-center space-y-8"
      >
        {/* Ring + Logo Container */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Rotating Ring */}
          <motion.div className="absolute inset-0 rounded-full border-4 border-gray-200">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-green-500"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center"
          >
            <motion.img
              src={logo}
              alt="Super Siesta Logo"
              className="w-full h-full object-contain p-4"
            />
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-gray-600 text-lg"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}
