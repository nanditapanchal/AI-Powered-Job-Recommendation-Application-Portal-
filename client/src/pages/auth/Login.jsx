import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      // Redirect based on role
      if (res.user.role === 'candidate') navigate('/candidate');
      else if (res.user.role === 'recruiter') navigate('/recruiter');
      else navigate('/admin');
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 transition-all duration-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-300"
      >
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Login</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="relative mb-6">
          <input
            type="email"
            id="email"
            placeholder=" "
            className="peer w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm"
          >
            Email
          </label>
        </div>

        <div className="relative mb-6">
          <input
            type="password"
            id="password"
            placeholder=" "
            className="peer w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm"
          >
            Password
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <div className="mt-4 text-center text-gray-600">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="mt-2 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
