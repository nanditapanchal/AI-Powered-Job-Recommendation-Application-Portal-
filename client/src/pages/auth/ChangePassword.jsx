import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

export default function ChangePassword() {
  const { changePassword, logout } = useAuth();
  const navigate = useNavigate(); // ✅ useNavigate here
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await changePassword(oldPassword, newPassword);
      setMessage('Password changed successfully!');

      // Optional: clear user session after password change
      logout();
      navigate('/login'); // redirect to login
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change password');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-50 to-blue-50">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-green-600">
          Change Password
        </h2>

        {message && (
          <p
            className={`mb-4 text-center text-sm ${
              message.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <input
          type="password"
          placeholder="Old Password"
          className="w-full p-4 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-4 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full p-4 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            className="w-full py-4 text-white font-bold bg-green-600 hover:bg-green-700 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
