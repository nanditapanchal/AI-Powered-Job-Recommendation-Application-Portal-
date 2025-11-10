import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Target, Rocket, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-gray-100"
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 py-24 md:py-32 overflow-hidden">
        {/* Background lighting effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5"
        >
          <span className="text-indigo-400">JobRec</span>:{" "}
          <span className="text-white">Where Talent Meets Opportunity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl sm:max-w-2xl mb-10"
        >
          Harness the power of AI to connect recruiters and candidates faster than ever —
          effortless, intelligent, and personalized.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-400 to-violet-500 text-white font-semibold hover:scale-105 hover:shadow-xl px-6 py-3 rounded-lg shadow-md transition-all duration-300"
          >
            Get Started <ArrowRight className="ml-2 inline-block" size={18} />
          </Button>

          <Button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto bg-transparent border border-indigo-300 text-indigo-200 hover:bg-indigo-500 hover:text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300"
          >
            Login
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-gray-900 to-slate-800 text-gray-100">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Why Choose <span className="text-indigo-400">JobRec</span>?
        </motion.h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Briefcase className="text-indigo-400 w-10 h-10" />,
              title: "AI-Driven Job Matching",
              desc: "Instantly get the best opportunities tailored to your skills and goals using advanced machine learning.",
            },
            {
              icon: <Users className="text-violet-400 w-10 h-10" />,
              title: "Recruit Smarter, Faster",
              desc: "Recruiters can post jobs, analyze applicants, and find the perfect match — all from one dashboard.",
            },
            {
              icon: <Target className="text-blue-400 w-10 h-10" />,
              title: "Personalized Insights",
              desc: "Track hiring trends, analyze skill gaps, and make data-driven career or hiring decisions.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-indigo-400 text-center shadow-md hover:shadow-indigo-600/30 transition-all duration-300"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
{/* CTA Section */}
<section className="relative py-20 px-4 sm:px-8 md:px-12 bg-gradient-to-r from-indigo-700 via-violet-700 to-blue-600 text-center text-white overflow-hidden">
  <motion.div
    className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent)]"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1.5 }}
  />
  <Rocket className="absolute top-8 left-8 opacity-10 w-24 h-24" />
  <Sparkles className="absolute bottom-8 right-8 opacity-10 w-20 h-20" />

  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
  >
    Take Your Career to New Heights 🚀
  </motion.h2>
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.7 }}
    className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto"
  >
    Whether you're hiring or job hunting, JobRec empowers your next move with AI,
    insights, and speed.
  </motion.p>
</section>


      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 text-center border-t border-gray-800">
        <p className="text-sm sm:text-base">
          © {new Date().getFullYear()}{" "}
          <span className="text-indigo-400 font-semibold">JobRec</span>. Built by{" "}
          <span className="text-white">Nandita Panchal</span>.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-gray-500 text-sm">
          <a href="/about" className="hover:text-indigo-300 transition">
            About
          </a>
          <a href="/privacy" className="hover:text-indigo-300 transition">
            Privacy
          </a>
          <a href="/contact" className="hover:text-indigo-300 transition">
            Contact
          </a>
        </div>
      </footer>
    </motion.div>
  );
}
