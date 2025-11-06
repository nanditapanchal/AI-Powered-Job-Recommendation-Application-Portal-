import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center px-6 py-24 text-center"
      >
        <h1 className="text-4xl font-bold mb-6 text-blue-700">About JobRec</h1>
        <p className="max-w-2xl text-lg text-gray-600 leading-relaxed">
          JobRec is a modern recruitment platform that connects talented
          candidates with top employers using intelligent job-matching
          algorithms. Our goal is to simplify the hiring process and empower
          both candidates and recruiters to achieve success faster.
        </p>
      </motion.section>
    </div>
  );
}
