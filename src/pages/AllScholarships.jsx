import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1.5 }}
    className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden"
  >
    <div className="w-full h-48 bg-slate-700/30 animate-pulse" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-slate-700/30 rounded-lg w-3/4 animate-pulse" />
      <div className="h-5 bg-slate-700/30 rounded-lg w-1/2 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-700/30 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-slate-700/30 rounded-lg w-2/3 animate-pulse" />
        <div className="h-4 bg-slate-700/30 rounded-lg w-1/2 animate-pulse" />
        <div className="h-4 bg-slate-700/30 rounded-lg w-3/4 animate-pulse" />
      </div>
      <div className="h-12 bg-slate-700/30 rounded-xl w-full animate-pulse mt-4" />
    </div>
  </motion.div>
);

const AllScholarships = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDegree, setFilterDegree] = useState("");
  const [sortBy, setSortBy] = useState("applicationFees");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/scholarships`,
      );
      return res.data;
    },
  });

  const filtered = scholarships
    .filter((s) => {
      const matchesSearch =
        s.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.universityName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !filterCategory || s.scholarshipCategory === filterCategory;
      const matchesDegree = !filterDegree || s.degree === filterDegree;
      return matchesSearch && matchesCategory && matchesDegree;
    })
    .sort((a, b) => {
      if (sortBy === "applicationFees")
        return a.applicationFees - b.applicationFees;
      if (sortBy === "deadline")
        return (
          new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
        );
      if (sortBy === "rank")
        return a.universityWorldRank - b.universityWorldRank;
      return 0;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterDegree]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-16 mt-20">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            All Scholarships
          </h1>
          {!isLoading && (
            <p className="text-lg text-slate-200/80">
              <span className="text-cyan-300 font-semibold">
                {filtered.length}
              </span>{" "}
              opportunities available
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 mb-10 shadow-lg shadow-black/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by scholarship or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition"
              disabled={isLoading}
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition cursor-pointer"
              disabled={isLoading}
            >
              <option className="bg-slate-900 text-white" value="">
                All Categories
              </option>
              <option className="bg-slate-900 text-white">Full fund</option>
              <option className="bg-slate-900 text-white">Partial</option>
              <option className="bg-slate-900 text-white">Self-fund</option>
            </select>

            <select
              value={filterDegree}
              onChange={(e) => setFilterDegree(e.target.value)}
              className="px-4 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition cursor-pointer"
              disabled={isLoading}
            >
              <option className="bg-slate-900 text-white" value="">
                All Degrees
              </option>
              <option className="bg-slate-900 text-white">Bachelor</option>
              <option className="bg-slate-900 text-white">Masters</option>
              <option className="bg-slate-900 text-white">PhD</option>
              <option className="bg-slate-900 text-white">Diploma</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition cursor-pointer"
              disabled={isLoading}
            >
              <option
                className="bg-slate-900 text-white"
                value="applicationFees"
              >
                Sort: Lowest Fee First
              </option>
              <option className="bg-slate-900 text-white" value="deadline">
                Sort: Deadline Soonest
              </option>
              <option className="bg-slate-900 text-white" value="rank">
                Sort: Best Rank
              </option>
            </select>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl"
          >
            <p className="text-2xl font-semibold text-slate-200">
              No scholarships found
            </p>
            <p className="text-slate-300 mt-2">
              Try adjusting your search filters
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {currentItems.map((scholarship, idx) => (
                <motion.div
                  key={scholarship._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden hover:shadow-xl shadow-lg shadow-black/20 transition-all hover:border-white/30 group"
                >
                  <figure className="overflow-hidden relative h-48">
                    <img
                      src={scholarship.universityImage}
                      alt={scholarship.universityName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </figure>
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      {scholarship.scholarshipName}
                    </h2>
                    <p className="font-semibold text-cyan-200 mb-3">
                      {scholarship.universityName}
                    </p>
                    <div className="text-sm text-slate-200/80 space-y-2 mb-4">
                      <p>
                        📍 {scholarship.universityCity},{" "}
                        {scholarship.universityCountry}
                      </p>
                      <p>🏆 Rank: #{scholarship.universityWorldRank}</p>
                      <p>🎓 Degree: {scholarship.degree}</p>
                      <p className="text-emerald-300 font-semibold">
                        💰 Fee: ${scholarship.applicationFees}
                      </p>
                      <p className="text-amber-300">
                        📅{" "}
                        {format(
                          new Date(scholarship.applicationDeadline),
                          "dd MMM yyyy",
                        )}
                      </p>
                    </div>
                    <Link
                      to={`/scholarship-details/${scholarship._id}`}
                      className="block w-full py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 shadow-lg shadow-black/20 transition-all text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 rounded-xl font-semibold border border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-6 py-3 rounded-xl font-semibold border border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </motion.button>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4 text-slate-200/80 font-semibold"
            >
              Page <span className="text-cyan-300">{currentPage}</span> of{" "}
              <span className="text-cyan-300">{totalPages}</span>
            </motion.p>
          </>
        )}
      </div>
    </div>
  );
};

export default AllScholarships;
