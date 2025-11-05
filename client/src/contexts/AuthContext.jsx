import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // store JWT token
  const [loading, setLoading] = useState(true);

  // Load user + token from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      toast.success('Logged in successfully!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Register
  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password, role });
      toast.success('Registered successfully!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await axios.post('/auth/forgot-password', { email });
      toast.success('Password reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending email');
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      await axios.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resetting password');
      throw err;
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      if (!token) throw new Error('Not logged in');

      const res = await axios.post(
        '/auth/change-password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
