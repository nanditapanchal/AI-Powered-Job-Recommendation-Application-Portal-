import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 py-20 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          Your privacy is important to us. JobRec is committed to protecting
          your personal information and ensuring that your data remains secure.
        </p>
        <p className="text-gray-700 leading-relaxed">
          We never sell your information. We only use your data to improve your
          experience, match you with jobs, and keep your account secure. By
          using JobRec, you agree to our terms of responsible data handling.
        </p>
      </motion.section>
    </div>
  );
}
