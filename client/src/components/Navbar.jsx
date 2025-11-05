import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">JobRec</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span>{user.name}</span>
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/register" className="text-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
