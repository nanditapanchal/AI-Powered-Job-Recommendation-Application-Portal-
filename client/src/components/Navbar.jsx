import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
        >
          JobRec
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <span className="font-medium text-gray-700">
                Hi, {user.name}
              </span>
              <Link
                to="/change-password"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Change Password
              </Link>
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-700 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-inner border-t border-gray-100"
          >
            <div className="flex flex-col space-y-3 p-4 text-center">
              {user ? (
                <>
                  <span className="font-medium text-gray-700">
                    Hi, {user.name}
                  </span>
                  <Link
                    to="/change-password"
                    onClick={() => setMenuOpen(false)}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Change Password
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-lg"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-700 font-medium transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-700 font-medium transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
