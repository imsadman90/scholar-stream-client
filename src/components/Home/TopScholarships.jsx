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

const TopScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchTopScholarships = async () => {
      try {
        const response = await axiosSecure.get(
          `${import.meta.env.VITE_API_URL}/scholarships/top`
        );

        const sorted = response.data
          .sort(
            (a, b) =>
              new Date(b.scholarshipPostDate) - new Date(a.scholarshipPostDate)
          )
          .slice(0, 6);

        setScholarships(sorted.length > 0 ? sorted : []);
      } catch (error) {
        console.error("Failed to fetch scholarships:", error);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopScholarships();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Top Scholarships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card bg-base-200 shadow-xl animate-pulse">
                <div className="h-56 bg-base-300 rounded-t-xl"></div>
                <div className="card-body">
                  <div className="h-6 bg-base-300 rounded w-3/4"></div>
                  <div className="h-4 bg-base-300 rounded w-1/2 mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (scholarships.length === 0) {
    return (
      <section className="py-20 text-center">
        <p className="text-xl text-gray-500">No scholarships available yet.</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-base-100 px-10 to-base-200">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Top Scholarships
          </h2>
          <p className="text-lg text-base-content/70 mt-4">
            Latest and most prestigious opportunities worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships.map((scholarship) => (
            <motion.div
              key={scholarship._id}
              whileHover={{ y: -10 }}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-300"
            >
              <figure className="relative h-56">
                <img
                  src={
                    scholarship.universityImage ||
                    "https://via.placeholder.com/600x400?text=University"
                  }
                  alt={scholarship.universityName}
                  className="w-full h-full object-cover"
                />
              </figure>

              <div className="card-body p-6">
                <h4 className="font-bold text-lg line-clamp-2">
                  {scholarship.scholarshipName}
                </h4>

                <div className="space-y-3 my-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-accent" />
                    <span>
                      {scholarship.universityCity},{" "}
                      {scholarship.universityCountry}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-primary" />
                    <span>
                      {scholarship.degree} • {scholarship.subjectCategory}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-secondary" />
                    <span>
                      Deadline:{" "}
                      {new Date(
                        scholarship.applicationDeadline
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        scholarship.applicationFees === 0
                          ? "bg-success/10"
                          : "bg-primary/10"
                      }`}
                    >
                      <FaMoneyBillWave
                        className={
                          scholarship.applicationFees === 0
                            ? "text-success"
                            : "text-primary"
                        }
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xl">
                        {scholarship.applicationFees === 0
                          ? "Free"
                          : `$${scholarship.applicationFees}`}
                      </p>
                      <p className="text-xs opacity-60">Application Fee</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to={`/scholarship-details/${scholarship._id}`}>
                    <button className="btn btn-primary w-full">
                      View Details <GrLinkNext />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/scholarships">
            <button className="btn btn-outline btn-lg">
              View All Scholarships <GrLinkNext />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopScholarships;
