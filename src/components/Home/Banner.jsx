import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const Banner = () => {
  const handleSearchClick = () => {
    window.location.href = "/scholarships";
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 flex items-center overflow-hidden">
      {/* Container */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 mt-20 leading-tight"
          >
            Find Your Perfect{" "}
            <span className="text-yellow-300 inline-block">Scholarship</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Discover thousands of scholarship opportunities from top
            universities worldwide and take the first step toward your dream
            education.
          </motion.p>

          {/* Search Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={handleSearchClick}
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-3 rounded-lg shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              <FaSearch />
              Search Scholarships
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {[
              { number: "10K+", label: "Students" },
              { number: "500+", label: "Scholarships" },
              { number: "50+", label: "Countries" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center transition-transform hover:-translate-y-1"
              >
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 w-full -mb-1">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
            fillOpacity="0.1"
          />
          <path
            d="M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,90.7C672,96,768,96,864,90.7C960,85,1056,75,1152,74.7C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default Banner;
