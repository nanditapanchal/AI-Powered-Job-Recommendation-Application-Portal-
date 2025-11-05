import React from 'react';
import { motion } from 'framer-motion';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-6 rounded shadow-lg w-full max-w-md"
      >
        {children}
        <button
          className="mt-4 px-3 py-1 bg-red-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
