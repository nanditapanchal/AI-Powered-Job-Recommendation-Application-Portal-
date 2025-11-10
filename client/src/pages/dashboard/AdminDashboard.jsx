import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  Menu,
  LogOut,
  BarChart3,
  Moon,
  Sun,
  UserMinus,
  X,
} from "lucide-react";
import Loader from "../../components/Loader";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      axios.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("/admin/jobs", { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([userRes, jobRes]) => {
        setUsers(userRes.data);
        setJobs(jobRes.data);
      })
      .catch((err) => console.error("Error fetching admin data:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleBlockUser = async (id, isBlocked, role) => {
    if (role === "admin") return alert("Admin user cannot be blocked!");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `/admin/users/${id}/block`,
        { isBlocked: !isBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      console.error("Error toggling block:", err);
    }
  };

  const deleteUser = async (id, role) => {
    if (role === "admin") return alert("Admin user cannot be deleted!");
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `/admin/jobs/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs((prev) => prev.map((j) => (j._id === id ? res.data : j)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  // Analytics
  const totalUsers = users.length;
  const totalJobs = jobs.length;
  const approvedJobs = jobs.filter((j) => j.status === "approved").length;
  const pendingJobs = jobs.filter((j) => j.status === "pending").length;
  const recruiters = users.filter((u) => u.role === "recruiter").length;
  const candidates = users.filter((u) => u.role === "candidate").length;

  const userData = [
    { name: "Recruiters", value: recruiters },
    { name: "Candidates", value: candidates },
  ];

  const jobData = [
    { name: "Approved", value: approvedJobs },
    { name: "Pending", value: pendingJobs },
  ];

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

  const analyticsCards = [
    { label: "Total Users", value: totalUsers, color: "bg-blue-500", key: "users" },
    { label: "Recruiters", value: recruiters, color: "bg-indigo-500", key: "users" },
    { label: "Candidates", value: candidates, color: "bg-green-500", key: "users" },
    { label: "Total Jobs", value: totalJobs, color: "bg-purple-500", key: "jobs" },
    { label: "Approved Jobs", value: approvedJobs, color: "bg-emerald-500", key: "jobs" },
    { label: "Pending Jobs", value: pendingJobs, color: "bg-yellow-500", key: "jobs" },
  ];

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      } flex min-h-screen transition-colors duration-500`}
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className={`${
          darkMode ? "bg-gray-800" : "bg-blue-900"
        } fixed lg:relative z-30 h-full w-64 flex-shrink-0 p-5 space-y-6 text-white shadow-xl`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="space-y-3 mt-6">
          {[
            { name: "Analytics", icon: BarChart3, key: "analytics" },
            { name: "Users", icon: Users, key: "users" },
            { name: "Jobs", icon: Briefcase, key: "jobs" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition ${
                activeTab === tab.key
                  ? "bg-blue-700"
                  : "hover:bg-blue-800 hover:translate-x-1"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 mt-6"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </nav>

        <div className="mt-auto flex justify-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:ml-64 transition-all duration-300 overflow-y-auto relative">
        {/* Sticky Topbar (Mobile) */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between bg-opacity-80 backdrop-blur-md ${
            darkMode ? "bg-gray-900/80" : "bg-gray-100/70"
          } py-3 mb-6 px-2 sm:px-4`}
        >
          <h2 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h2>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-7 h-7" />
          </button>
        </div>

        {/* Animated Tab Transitions */}
        <AnimatePresence mode="wait">
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6">📊 Dashboard Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                {analyticsCards.map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className={`${stat.color} text-white p-6 rounded-2xl shadow-lg cursor-pointer text-center flex flex-col justify-center`}
                    onClick={() => setActiveTab(stat.key)}
                  >
                    <h3 className="text-lg font-medium">{stat.label}</h3>
                    <p className="text-4xl font-bold mt-2">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`rounded-2xl p-6 shadow-md ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    User Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={userData} dataKey="value" nameKey="name" outerRadius={120} label>
                        {userData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`rounded-2xl p-6 shadow-md ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Job Status Overview
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={jobData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6">👥 Manage Users</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {users.map((user) => (
                  <motion.div
                    key={user._id}
                    whileHover={{ scale: 1.03 }}
                    className={`rounded-2xl shadow p-5 border ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } flex flex-col items-center text-center`}
                  >
                    <img
                      src={
                        user.profile_pic_url ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="profile"
                      className="w-20 h-20 rounded-full object-cover border mb-3"
                    />
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <span
                      className={`mt-2 text-sm font-medium px-3 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "recruiter"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role}
                    </span>

                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => toggleBlockUser(user._id, user.isBlocked, user.role)}
                        disabled={user.role === "admin"}
                        className={`px-3 py-1 rounded-lg text-white text-sm ${
                          user.isBlocked ? "bg-green-600" : "bg-yellow-600"
                        } ${
                          user.role === "admin" && "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id, user.role)}
                        disabled={user.role === "admin"}
                        className={`px-3 py-1 rounded-lg bg-red-600 text-white text-sm ${
                          user.role === "admin" && "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <UserMinus className="w-4 h-4 inline mr-1" /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "jobs" && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6">💼 Manage Jobs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <motion.div
                    key={job._id}
                    whileHover={{ scale: 1.03 }}
                    className={`rounded-2xl shadow p-5 border flex flex-col justify-between ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <p className="text-gray-500">{job.company}</p>
                      <p className="text-sm text-gray-400">{job.location}</p>
                      <p className="mt-2 text-gray-300 line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : job.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {job.status || "pending"}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(job._id, "approved")}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(job._id, "rejected")}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
