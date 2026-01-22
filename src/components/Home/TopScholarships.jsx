import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { GrLinkNext } from "react-icons/gr";
import {
  FaMapMarkerAlt,
  FaGraduationCap,
  FaMoneyBillWave,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SkeletonCard = () => (
  <div className="rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800 shadow-lg shadow-black/5 overflow-hidden backdrop-blur">
    <div className="relative h-52 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 animate-pulse" />

    <div className="p-6 space-y-4">
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />

      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <span className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </div>

      <div className="h-11 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
    </div>
  </div>
);

const TopScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchTopScholarships = async () => {
      try {
        const response = await axiosSecure.get(
          `${import.meta.env.VITE_API_URL}/scholarships/top`,
        );

        const sorted = response.data
          .sort(
            (a, b) =>
              new Date(b.scholarshipPostDate) - new Date(a.scholarshipPostDate),
          )
          .slice(0, 6);

        setScholarships(sorted.length > 0 ? sorted : []);
      } catch (error) {
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopScholarships();
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-10 left-1/4 h-72 w-72 bg-purple-600 blur-[120px]" />
          <div className="absolute top-20 right-1/4 h-80 w-80 bg-indigo-500 blur-[140px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur text-xs uppercase tracking-[0.25em] font-semibold">
              Curated list
            </div>
            <h2 className="text-4xl md:text-5xl font-black mt-5">
              Top Scholarships
            </h2>
            <p className="text-lg text-slate-200/80 mt-3 max-w-2xl mx-auto">
              Latest, most prestigious opportunities — refreshed for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (scholarships.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Top Scholarships
          </h2>
          <p className="text-lg text-slate-200/80">
            No scholarships available yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 left-0 h-80 w-80 bg-purple-600 blur-[140px]" />
        <div className="absolute top-10 right-10 h-64 w-64 bg-cyan-500 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur text-xs uppercase tracking-[0.25em] font-semibold">
            Editor's pick
          </div>
          <h2 className="text-4xl md:text-5xl font-black mt-5">
            Top Scholarships
          </h2>
          <p className="text-lg text-slate-200/80 mt-3 max-w-2xl mx-auto">
            Latest and most prestigious opportunities worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships.map((scholarship) => (
            <motion.div
              key={scholarship._id}
              whileHover={{ y: -10 }}
              className="relative rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden"
            >
              <figure className="relative h-52 overflow-hidden">
                <img
                  src={
                    scholarship.universityImage ||
                    "https://via.placeholder.com/600x400?text=University"
                  }
                  alt={scholarship.universityName}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur">
                  New
                </div>
              </figure>

              <div className="p-6 space-y-4">
                <h4 className="font-bold text-xl leading-tight line-clamp-2 text-white">
                  {scholarship.scholarshipName}
                </h4>

                <div className="space-y-3 text-sm text-slate-200/90">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-cyan-300" />
                    <span>
                      {scholarship.universityCity},{" "}
                      {scholarship.universityCountry}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-purple-300" />
                    <span>
                      {scholarship.degree} • {scholarship.subjectCategory}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-amber-300" />
                    <span>
                      Deadline:{" "}
                      {new Date(
                        scholarship.applicationDeadline,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-2xl border border-white/10 ${
                        scholarship.applicationFees === 0
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-purple-400/15 text-purple-200"
                      }`}
                    >
                      <FaMoneyBillWave />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-white">
                        {scholarship.applicationFees === 0
                          ? "Free"
                          : `$${scholarship.applicationFees}`}
                      </p>
                      <p className="text-xs text-slate-300/80">
                        Application Fee
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link to={`/scholarship-details/${scholarship._id}`}>
                    <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white font-semibold px-5 py-3 shadow-lg shadow-purple-500/30 hover:shadow-xl transition">
                      View Details <GrLinkNext />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link to="/scholarships">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition">
              View All Scholarships <GrLinkNext />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopScholarships;
