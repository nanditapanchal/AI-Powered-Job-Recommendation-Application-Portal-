import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        JobRec
      </Link>

      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <span className="font-medium text-gray-700">{user.name}</span>
            <Link
              to="/change-password"
              className="text-green-600 hover:underline font-medium"
            >
              Change Password
            </Link>
            <Button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
