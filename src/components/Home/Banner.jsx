import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const Banner = () => {
  const handleSearchClick = () => {
    window.location.href = "/scholarships";
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 text-white">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -top-32 -left-20 h-96 w-96 bg-purple-600 blur-[120px]" />
        <div className="absolute top-10 right-0 h-80 w-80 bg-indigo-500 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 bg-cyan-400 blur-[120px]" />
      </div>

      {/* Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur text-sm font-semibold"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Curated global scholarships, updated daily
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
            >
              Find the scholarship that matches your ambition
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-amber-200 to-cyan-200">
                with ScholarStream
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-slate-200 max-w-2xl"
            >
              Discover fully funded, merit-based, and need-based programs from
              the top universities worldwide. We surface the right
              opportunities, deadlines, and requirements—so you can focus on
              winning.
            </motion.p>

            {/* Search Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={handleSearchClick}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white font-semibold px-6 sm:px-7 py-3 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:brightness-110 transition-all"
              >
                <FaSearch className="text-lg" />
                Explore scholarships
              </button>
              <div className="text-sm text-slate-200/80">
                Trusted by{" "}
                <span className="font-semibold text-white">10,000+</span>{" "}
                applicants
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl"
            >
              {[
                { number: "10K+", label: "Students onboarded" },
                { number: "500+", label: "Active scholarships" },
                { number: "50+", label: "Countries covered" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="glass-panel rounded-2xl border border-white/15 bg-white/5 backdrop-blur px-4 py-4 shadow-lg shadow-black/10"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-200/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right visuals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative"
          >
            <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20 p-6 sm:p-8">
              <div className="absolute -top-6 -right-10 h-28 w-28 rounded-full bg-gradient-to-br from-amber-300/40 to-purple-500/30 blur-2xl" />
              <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-300/30 to-indigo-500/30 blur-2xl" />

              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-200/70">
                      Live opportunities
                    </p>
                    <p className="text-3xl font-bold text-white">482</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-100 border border-emerald-200/40">
                    Updated now
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["STEM", "Business", "Humanities", "Medicine"].map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5"
                    >
                      <span className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-300 to-cyan-300" />
                      <p className="text-sm font-semibold text-white">
                        {tag} scholarships
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-center justify-between text-sm text-slate-200/80">
                    <span>Next deadlines</span>
                    <span className="text-emerald-200 font-semibold">
                      This week
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-white/90">
                    <div className="flex items-center justify-between">
                      <span>Rhodes Scholarship</span>
                      <span className="text-slate-200/70">Jan 31</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fulbright Program</span>
                      <span className="text-slate-200/70">Feb 04</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Chevening Awards</span>
                      <span className="text-slate-200/70">Feb 12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
