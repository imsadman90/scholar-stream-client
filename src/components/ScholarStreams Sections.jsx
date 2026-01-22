import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  TrendingUp,
  Users,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Shield,
  Globe,
  DollarSign,
  Search,
  FileText,
  Bell,
  Calendar,
} from "lucide-react";
import { Link } from "react-router";

export default function ScholarStreamSections() {
  return (
    <div className="min-h-screen bg-slate-950 transition-colors">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute -top-40 -left-20 h-96 w-96 bg-purple-600 blur-[150px]" />
          <div className="absolute top-20 right-10 h-80 w-80 bg-cyan-500 blur-[140px]" />
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
              <GraduationCap size={60} className="text-cyan-300" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
          >
            Find Your Perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
              Scholarship
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-slate-200 max-w-3xl mx-auto"
          >
            Discover thousands of scholarship opportunities tailored to your
            profile and dreams
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link
              to="/scholarships"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:brightness-110 transition-all flex items-center gap-2"
            >
              Browse Scholarships <ArrowRight size={20} />
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              Create Free Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur text-xs uppercase tracking-[0.25em] font-semibold text-white mb-4">
              Core Features
            </div>
            <h2 className="text-4xl font-black text-white mb-3">
              Why Choose ScholarStream?
            </h2>
            <p className="text-slate-200/80 text-lg max-w-2xl mx-auto">
              Everything you need to fund your education journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Search className="text-cyan-300" size={40} />,
                title: "Smart Matching",
                desc: "AI-powered algorithm matches you with scholarships based on your profile.",
              },
              {
                icon: <Bell className="text-emerald-300" size={40} />,
                title: "Deadline Alerts",
                desc: "Never miss an opportunity with automated reminders.",
              },
              {
                icon: <FileText className="text-purple-300" size={40} />,
                title: "Application Tracking",
                desc: "Manage all applications in one organized dashboard.",
              },
              {
                icon: <Shield className="text-red-300" size={40} />,
                title: "Verified Listings",
                desc: "Every scholarship is verified to ensure legitimacy.",
              },
              {
                icon: <Globe className="text-indigo-300" size={40} />,
                title: "Global Database",
                desc: "Access scholarships worldwide.",
              },
              {
                icon: <BookOpen className="text-amber-300" size={40} />,
                title: "Resources & Tips",
                desc: "Expert guidance to win scholarships.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 hover:shadow-xl shadow-lg shadow-black/20 transition-shadow"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-200/80">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-center mb-14 text-white"
          >
            Our Impact on Students
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: "50K+",
                label: "Scholarships Listed",
                icon: <Award size={40} />,
              },
              {
                number: "$2.5B+",
                label: "Awarded",
                icon: <DollarSign size={40} />,
              },
              {
                number: "500K+",
                label: "Active Students",
                icon: <Users size={40} />,
              },
              {
                number: "98%",
                label: "Success Rate",
                icon: <TrendingUp size={40} />,
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-8 text-center hover:shadow-xl shadow-lg shadow-black/20 transition-shadow"
              >
                <div className="text-cyan-300 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-5xl font-black mb-2 text-white">
                  {stat.number}
                </div>
                <div className="text-slate-200/80 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black text-white mb-3">
              Powerful Features for Smart Students
            </h2>
            <p className="text-slate-200/80 text-lg max-w-2xl mx-auto">
              Everything you need to discover, track, and win scholarships
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Smart Scholarship Matching",
                desc: "Our system analyzes your profile and recommends scholarships you’re most eligible for.",
              },
              {
                title: "Verified & Trusted Listings",
                desc: "Every scholarship is carefully reviewed to protect students from scams.",
              },
              {
                title: "Deadline Reminders",
                desc: "Get notified before deadlines so you never miss an opportunity.",
              },
              {
                title: "Application Tracking",
                desc: "Track all your applications from one organized dashboard.",
              },
              {
                title: "Global Opportunities",
                desc: "Access local and international scholarships from around the world.",
              },
              {
                title: "Expert Resources",
                desc: "Get guides and tips to improve essays, resumes, and interviews.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 hover:shadow-xl shadow-lg shadow-black/20 transition-shadow"
              >
                <h3 className="text-xl font-semibold text-cyan-200 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-200/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black text-white mb-3">
              How ScholarStream Works
            </h2>
            <p className="text-slate-200/80 text-lg max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Sign up and add your academic background, interests, and goals.",
              },
              {
                step: "02",
                title: "Get Matched",
                desc: "We match you with scholarships based on your eligibility and preferences.",
              },
              {
                step: "03",
                title: "Apply & Track",
                desc: "Apply confidently and track your applications in one place.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-8 text-center hover:shadow-xl shadow-lg shadow-black/20 transition-shadow"
              >
                <div className="text-7xl font-black text-purple-400/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">
                  {item.title}
                </h3>
                <p className="text-slate-200/80 relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog / Resources Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black text-white mb-3">
              Scholarship Tips & Resources
            </h2>
            <p className="text-slate-200/80 text-lg max-w-2xl mx-auto">
              Learn how to improve your chances of winning scholarships
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "How to Write a Winning Scholarship Essay",
                desc: "Proven tips to make your essay stand out from thousands of applicants.",
              },
              {
                title: "Top Fully Funded Scholarships in 2025",
                desc: "A curated list of fully funded local and international scholarships.",
              },
              {
                title: "Common Mistakes Students Make",
                desc: "Avoid these mistakes to increase your scholarship success rate.",
              },
            ].map((blog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 hover:shadow-xl shadow-lg shadow-black/20 transition-shadow"
              >
                <h3 className="text-xl font-semibold text-cyan-200 mb-2">
                  {blog.title}
                </h3>
                <p className="text-slate-200/80">{blog.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights / Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black text-white mb-3">
              Why Students Love ScholarStream
            </h2>
            <p className="text-slate-200/80 text-lg max-w-2xl mx-auto">
              Designed to save time, reduce stress, and increase success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Save Research Time",
                desc: "No more endless searching. Find relevant scholarships in minutes.",
              },
              {
                title: "Never Miss Deadlines",
                desc: "Smart reminders keep you ahead of every important date.",
              },
              {
                title: "100% Scam-Free",
                desc: "All scholarships are verified for safety and authenticity.",
              },
              {
                title: "Higher Success Rate",
                desc: "Personalized matches improve your chances of winning.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 hover:shadow-xl shadow-lg shadow-black/20 transition-shadow text-center"
              >
                <h3 className="text-xl font-semibold text-emerald-200 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-200/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-black text-white mb-3">
              Get Scholarship Alerts in Your Inbox
            </h2>
            <p className="text-slate-200/80 text-lg">
              Subscribe to receive the latest scholarships, deadlines, and
              expert tips.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto mb-6"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-slate-300 focus:outline-none focus:border-white/50 focus:bg-white/15 transition"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-600/30 shadow-lg shadow-black/20 transition-shadow"
            >
              Subscribe
            </button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center text-sm text-slate-400"
          >
            No spam. Unsubscribe anytime.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-[150px] opacity-20 -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="mx-auto mb-8 w-20 h-20 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl flex items-center justify-center"
          >
            <GraduationCap size={48} className="text-cyan-200" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent"
          >
            Start Your Scholarship Journey Today
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-slate-200/90 mb-10 max-w-2xl mx-auto"
          >
            Join over 500,000 students worldwide finding their perfect
            scholarships
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            viewport={{ once: true }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-xl hover:shadow-emerald-500/40 shadow-lg shadow-black/30 transition-all hover:scale-105 active:scale-95"
            >
              Create Free Account
            </Link>
            <Link
              to="/scholarships"
              className="px-8 py-4 rounded-xl font-semibold border-2 border-white/40 text-white backdrop-blur-sm bg-white/10 hover:border-white/60 hover:bg-white/20 hover:shadow-lg shadow-lg shadow-black/20 transition-all hover:scale-105 active:scale-95"
            >
              Explore Scholarships
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
