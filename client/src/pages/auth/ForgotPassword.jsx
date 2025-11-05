import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import Button from '../../components/Button';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await forgotPassword(email);
      setMessage('Reset link sent! Check your email.');
      setEmail('');
    } catch (err) {
      setMessage('Failed to send reset link. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-50">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-600">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-4 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {message && (
          <p className="mb-4 text-center text-sm text-green-600">{message}</p>
        )}

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            className="w-full py-4 text-white font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
