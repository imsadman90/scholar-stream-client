import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaUniversity,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaGraduationCap,
  FaStar,
  FaClock,
  FaUserTie,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewUsers, setReviewUsers] = useState({});
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);

  // -------- Public Scholarship Fetch --------
  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/scholarships/${id}`,
        );
        setScholarship(res.data);
      } catch (error) {
        setScholarship(null);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [id]);

  // -------- Public Reviews Fetch --------
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/reviews/scholarship/${id}`,
        );
        setReviews(res.data);

        const emails = [...new Set(res.data.map((r) => r.userEmail))];
        const users = await Promise.all(
          emails.map((e) =>
            axios.get(`${import.meta.env.VITE_API_URL}/users/${e}`),
          ),
        );
        const map = {};
        users.forEach((u) => (map[u.data.email] = u.data.photoURL));
        setReviewUsers(map);
      } catch (error) {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  // -------- Check if user already applied --------
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user?.email || !id) {
        setCheckingApplication(false);
        return;
      }
      try {
        const res = await axiosSecure.get(
          `/application/check/${id}/${user.email}`,
        );
        setHasApplied(res.data.hasApplied);
      } catch (error) {
        setHasApplied(false);
      } finally {
        setCheckingApplication(false);
      }
    };
    checkExistingApplication();
  }, [id, user?.email, axiosSecure]);

  // -------- Apply Button Handler --------
  const handleApply = () => {
    if (!user) {
      toast("Please login to apply!", { icon: "🔒" });
      navigate("/login");
      return;
    }

    if (hasApplied) {
      toast.info("You have already applied for this scholarship");
      navigate("/dashboard/my-applications");
      return;
    }

    navigate(`/apply/${id}`);
  };

  // -------- Reviews Scroll Handlers --------
  const scrollLeft = () => {
    if (scrollRef.current?.firstChild) {
      const w = scrollRef.current.firstChild.offsetWidth + 24;
      scrollRef.current.scrollBy({ left: -w, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current?.firstChild) {
      const w = scrollRef.current.firstChild.offsetWidth + 24;
      scrollRef.current.scrollBy({ left: w, behavior: "smooth" });
    }
  };

  // -------- Loading / Error UI --------
  if (loading || checkingApplication) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/scholarships" className="btn btn-primary">
          Browse Scholarships
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-10 py-12 mt-16 sm:mt-20 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Scholarship Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 sm:p-6 space-y-4 shadow-lg shadow-black/20"
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={
                  scholarship.universityImage || "/placeholder-university.jpg"
                }
                alt={scholarship.universityName}
                className="w-full h-52 sm:h-60 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>

            <div className="flex flex-wrap gap-2">
              {scholarship.universityWorldRank && (
                <span className="px-3 py-2 rounded-full text-sm bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-2">
                  <FaStar /> Rank #{scholarship.universityWorldRank}
                </span>
              )}
              <span className="px-3 py-2 rounded-full text-sm bg-cyan-500/20 text-cyan-100 border border-cyan-400/30">
                {scholarship.scholarshipCategory}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black leading-tight">
              {scholarship.scholarshipName}
            </h1>
            <p className="flex items-center gap-2 text-slate-200/80 text-sm sm:text-base">
              <FaUniversity /> {scholarship.universityName}
            </p>
          </motion.div>

          {/* Key Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              icon={<FaMapMarkerAlt />}
              title="Location"
              value={`${scholarship.universityCity}, ${scholarship.universityCountry}`}
            />
            <InfoCard
              icon={<FaGraduationCap />}
              title="Degree"
              value={scholarship.degree}
            />
            <InfoCard
              icon={<FaCalendarAlt />}
              title="Deadline"
              value={new Date(
                scholarship.applicationDeadline,
              ).toLocaleDateString()}
            />
            <InfoCard
              icon={<FaClock />}
              title="Posted On"
              value={new Date(
                scholarship.scholarshipPostDate,
              ).toLocaleDateString()}
            />
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 sm:p-6 shadow-lg shadow-black/20"
          >
            <h2 className="text-xl font-bold mb-3 text-white">Description</h2>
            <p className="text-slate-200/80 leading-relaxed text-sm sm:text-base">
              {scholarship.scholarshipDescription || "No description provided."}
            </p>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Monthly Stipend */}
          {scholarship.stipendAmount && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 backdrop-blur-xl p-4 sm:p-6 shadow-lg shadow-black/20"
            >
              <p className="text-sm text-emerald-100">Monthly Stipend</p>
              <p className="text-3xl font-black text-white">
                {scholarship.stipendAmount}
              </p>
            </motion.div>
          )}

          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 sm:p-6 shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Reviews ({reviews.length})</h2>
              <div className="flex gap-2 text-amber-300 text-sm">
                <FaStar /> <span>Real student feedback</span>
              </div>
            </div>
            {reviewsLoading ? (
              <p className="text-center text-slate-200/70">
                Loading reviews...
              </p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-slate-200/70">No reviews yet</p>
            ) : (
              <div className="relative">
                <button
                  onClick={scrollLeft}
                  className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white/10 border border-white/20 shadow-xl rounded-full p-2 text-white hover:border-white/40"
                >
                  <FaChevronLeft />
                </button>

                <button
                  onClick={scrollRight}
                  className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white/10 border border-white/20 shadow-xl rounded-full p-2 text-white hover:border-white/40"
                >
                  <FaChevronRight />
                </button>

                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto gap-4 pb-4 scroll-smooth"
                >
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="min-w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur p-4 flex gap-4"
                    >
                      <img
                        src={reviewUsers[review.userEmail] || "/avatar.png"}
                        className="w-12 h-12 rounded-full object-cover border border-white/20"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold text-sm sm:text-base text-white">
                            {review.userName}
                          </h4>
                          <span className="text-xs text-slate-300">
                            {new Date(review.reviewDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-1 my-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={14}
                              className={
                                i < review.ratingPoint
                                  ? "text-amber-300"
                                  : "text-slate-600"
                              }
                            />
                          ))}
                        </div>

                        <p className="text-sm text-slate-200/80">
                          {review.reviewComment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Cost Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 sm:p-6 space-y-4 shadow-lg shadow-black/20"
          >
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <FaMoneyBillWave /> Cost Summary
            </h3>
            <CostRow label="Tuition Fees" value={scholarship.tuitionFees} />
            <CostRow
              label="Application Fee"
              value={
                scholarship.applicationFees === 0
                  ? "FREE"
                  : `$${scholarship.applicationFees}`
              }
            />
            <CostRow
              label="Service Charge"
              value={`$${scholarship.serviceCharge || 0}`}
            />
            <div className="pt-3 border-t border-white/10">
              <p className="text-sm text-slate-200/70">Total Cost</p>
              <p className="text-2xl font-black text-white">
                $
                {(
                  (scholarship.tuitionFees || 0) +
                  (scholarship.applicationFees || 0) +
                  (scholarship.serviceCharge || 0)
                ).toLocaleString()}
              </p>
            </div>
          </motion.div>

          {/* Posted By */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 sm:p-6 shadow-lg shadow-black/20"
          >
            <h3 className="font-bold flex items-center gap-2 mb-2 text-white">
              <FaUserTie /> Posted By
            </h3>
            <p className="text-sm text-slate-200/80 break-all">
              {scholarship.postedUserEmail}
            </p>
          </motion.div>

          {/* Apply Button */}
          {checkingApplication ? (
            <button className="w-full py-3 rounded-xl font-semibold border border-white/20 bg-white/10 text-white">
              Checking...
            </button>
          ) : hasApplied ? (
            <button
              className="w-full py-3 rounded-xl font-semibold border border-emerald-400/40 bg-emerald-500/20 text-emerald-100"
              disabled
            >
              Applied
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/40 shadow-lg shadow-black/30 transition-all"
            >
              Apply Now
            </button>
          )}

          <Link
            to="/"
            className="w-full py-3 rounded-xl font-semibold border border-white/30 text-white backdrop-blur-sm bg-white/5 hover:border-white/50 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

// ---------- InfoCard Component ----------
const InfoCard = ({ icon, title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 flex gap-3 shadow-lg shadow-black/15"
  >
    <div className="text-cyan-300 text-lg sm:text-xl">{icon}</div>
    <div>
      <p className="text-xs sm:text-sm text-slate-300">{title}</p>
      <p className="font-semibold text-sm sm:text-base text-white">{value}</p>
    </div>
  </motion.div>
);

// ---------- CostRow Component ----------
const CostRow = ({ label, value }) => (
  <div className="flex justify-between text-sm text-slate-200/80">
    <span>{label}</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

export default ScholarshipDetails;
