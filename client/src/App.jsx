import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import { useAuth } from './contexts/AuthContext';
import ChangePassword from './pages/auth/ChangePassword';
import ViewApplicants from './pages/dashboard/ViewApplicants';
import Home from "./pages/Home";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="/change-password" element={
  <ProtectedRoute>
    <ChangePassword />
  </ProtectedRoute>
} />
        <Route path="/candidate" element={<ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>} />
        <Route path="/recruiter" element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
<Route path="/recruiter/candidates/:jobId" element={<ViewApplicants />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
