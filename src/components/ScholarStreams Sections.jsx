import React from "react";
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
    <div className="min-h-screen bg-white transition-colors">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <GraduationCap size={80} className="text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Perfect Scholarship
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover thousands of scholarship opportunities tailored to your
            profile and dreams
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/scholarships"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              Browse Scholarships <ArrowRight size={20} />
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-base-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-400">
            Why Choose ScholarStream?
          </h2>
          <p className="text-center text-gray-600 mb-12 dark:text-gray-400">
            Everything you need to fund your education journey
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="text-blue-500" size={40} />,
                title: "Smart Matching",
                desc: "AI-powered algorithm matches you with scholarships based on your profile.",
              },
              {
                icon: <Bell className="text-green-500" size={40} />,
                title: "Deadline Alerts",
                desc: "Never miss an opportunity with automated reminders.",
              },
              {
                icon: <FileText className="text-purple-500" size={40} />,
                title: "Application Tracking",
                desc: "Manage all applications in one organized dashboard.",
              },
              {
                icon: <Shield className="text-red-500" size={40} />,
                title: "Verified Listings",
                desc: "Every scholarship is verified to ensure legitimacy.",
              },
              {
                icon: <Globe className="text-indigo-500" size={40} />,
                title: "Global Database",
                desc: "Access scholarships worldwide.",
              },
              {
                icon: <BookOpen className="text-yellow-500" size={40} />,
                title: "Resources & Tips",
                desc: "Expert guidance to win scholarships.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow dark:bg-base-200"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-400">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section className="py-20 px-6 bg-white dark:bg-base-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-400">
            Our Impact on Students
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
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
              <div key={idx} className="p-6">
                <div className="text-blue-600 mb-4 flex justify-center ">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-2 text-gray-900 dark:text-green-400">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-purple-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-base-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 dark:text-purple-500">
            Powerful Features for Smart Students
          </h2>
          <p className="text-center text-gray-600 mb-12 dark:text-gray-400">
            Everything you need to discover, track, and win scholarships
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition dark:bg-base-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-400">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white dark:bg-base-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 dark:text-green-400">
            How ScholarStream Works
          </h2>
          <p className="text-center text-gray-600 mb-12 dark:text-gray-400">
            Get started in just three simple steps
          </p>

          <div className="grid md:grid-cols-3 gap-8">
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
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl text-center shadow-md dark:bg-base-100"
              >
                <div className="text-6xl font-bold text-blue-600 mb-4 opacity-20">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 dark:text-gray-400">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog / Resources Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-base-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 dark:text-purple-500">
            Scholarship Tips & Resources
          </h2>
          <p className="text-center text-gray-600 mb-12 dark:text-gray-400">
            Learn how to improve your chances of winning scholarships
          </p>

          <div className="grid md:grid-cols-3 gap-8">
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
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition dark:bg-base-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-green-500">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-4 dark:text-gray-400">
                  {blog.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights / Benefits Section */}
      <section className="py-20 px-6 bg-white dark:bg-base-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 dark:text-green-500">
            Why Students Love ScholarStream
          </h2>
          <p className="text-center text-gray-600 mb-12 dark:text-gray-400">
            Designed to save time, reduce stress, and increase success
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
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
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition dark:bg-base-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-400">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-base-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 dark:text-purple-500">
            Get Scholarship Alerts in Your Inbox
          </h2>
          <p className="text-gray-600 mb-8 dark:text-gray-400">
            Subscribe to receive the latest scholarships, deadlines, and expert
            tips.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <GraduationCap size={64} className="mx-auto mb-6 text-yellow-300" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Scholarship Journey Today
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join over 500,000 students worldwide
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/scholarships"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Explore Scholarships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
