import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, Users, Target, ArrowRight, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800"
    >
      {/* Navbar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Navbar />
      </motion.div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 md:px-12 py-24 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-800 text-white">
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8 }}
        />

        {/* Hero content */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg"
        >
          Empowering <span className="text-yellow-300">Careers</span> &{" "}
          <span className="text-teal-300">Building Teams</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl"
        >
          Discover a smarter way to connect job seekers and recruiters through
          AI-powered insights and real-time opportunities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/register">
            <Button className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-blue-900 font-semibold hover:scale-105 hover:shadow-xl px-6 py-3 rounded-lg shadow-md transition-all duration-300">
              Get Started <ArrowRight className="ml-2 inline-block" size={18} />
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-700 px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300">
              Login
            </Button>
          </Link>
        </motion.div>

        {/* Floating element */}
        <motion.div
          className="absolute -bottom-12 right-12 opacity-30"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Zap size={100} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
        >
          Why <span className="text-blue-600">JobRec</span> is Your Smart Choice
        </motion.h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Briefcase className="text-blue-600" size={34} />,
              title: "AI-Powered Job Matching",
              desc: "Get personalized job suggestions using advanced AI analysis of your profile and career goals.",
              delay: 0.1,
            },
            {
              icon: <Users className="text-purple-600" size={34} />,
              title: "Smart Recruiter Dashboard",
              desc: "Manage job posts, track applications, and discover ideal candidates with one click.",
              delay: 0.2,
            },
            {
              icon: <Target className="text-green-600" size={34} />,
              title: "Data-Driven Insights",
              desc: "Monitor hiring trends and improve decisions through real-time analytics and recommendations.",
              delay: 0.3,
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: f.delay, duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04 }}
              className="bg-gradient-to-b from-gray-50 to-white p-8 rounded-2xl border shadow-sm hover:shadow-xl text-center transition-all duration-300"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {f.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 md:px-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Start Your Journey with{" "}
          <span className="text-yellow-300">JobRec</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto"
        >
          Whether you’re hiring top talent or landing your dream job, JobRec is
          designed to make it effortless, fast, and delightful.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link to="/register">
            <Button className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-blue-900 font-semibold hover:scale-105 hover:shadow-xl px-8 py-3 rounded-lg shadow-lg transition-all">
              Join Now
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">JobRec</span>. All rights reserved to Nandita Panchal.
        </p>
        <div className="flex justify-center gap-6 mt-3 text-gray-500 text-sm">
          <Link to="/about" className="hover:text-white transition">
            About
          </Link>
          <Link to="/privacy" className="hover:text-white transition">
            Privacy
          </Link>
          <Link to="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </div>
      </footer>
    </motion.div>
  );
}
