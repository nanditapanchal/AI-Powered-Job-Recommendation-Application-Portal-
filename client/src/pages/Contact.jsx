import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center px-6 py-24 text-center"
      >
        <h1 className="text-4xl font-bold mb-6 text-blue-700">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          Have questions or feedback? We’d love to hear from you.
        </p>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md border"
          >
            <Mail className="mx-auto text-blue-600 mb-3" size={36} />
            <p className="font-semibold">Email</p>
            <p className="text-gray-600">nanditapanchalg@gmail.com</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md border"
          >
            <Phone className="mx-auto text-blue-600 mb-3" size={36} />
            <p className="font-semibold">Phone</p>
            <p className="text-gray-600">+91 9368204833</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md border"
          >
            <MapPin className="mx-auto text-blue-600 mb-3" size={36} />
            <p className="font-semibold">Location</p>
            <p className="text-gray-600">India</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
