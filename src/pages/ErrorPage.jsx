import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Home, Search } from "lucide-react";

const ErrorPage = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <GraduationCap className="w-12 h-12 text-indigo-600" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-indigo-600 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! The scholarship page you are looking for doesn’t exist or may
          have been moved. Don’t worry, your future opportunities are still
          waiting for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            to="/scholarships"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition"
          >
            <Search className="w-5 h-5" />
            Browse Scholarships
          </Link>
        </div>

        <p className="mt-10 text-sm text-gray-400">
          © {new Date().getFullYear()} ScholarStream · Empowering Education
        </p>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
