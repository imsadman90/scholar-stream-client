import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
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
  const scrollRef = useRef(null);
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewUsers, setReviewUsers] = useState({});

  const handleApply = () => {
    window.location.href = `/apply/${id}`;
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.firstChild.offsetWidth + 24;
      scrollRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.firstChild.offsetWidth + 24;
      scrollRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/reviews/scholarship/${id}`
        );
        setReviews(res.data);

        const uniqueEmails = [...new Set(res.data.map((r) => r.userEmail))];

        const usersRes = await Promise.all(
          uniqueEmails.map((email) =>
            axios.get(`${import.meta.env.VITE_API_URL}/users/${email}`)
          )
        );

        const userMap = {};
        usersRes.forEach((u) => {
          userMap[u.data.email] = u.data.photoURL;
        });

        setReviewUsers(userMap);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/scholarships/${id}`
        );
        setScholarship(res.data);
      } catch (err) {
        console.error("Failed to load scholarship:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Scholarship Not Found</h2>
          <Link to="/all-scholarships" className="btn btn-primary">
            Browse Scholarships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-15 px-10 mt-20">
      <h1 className="text-5xl text-center mb-15 text-gray-800 italic">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Scholarship
        </span>{" "}
        Details
      </h1>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <img
              src={scholarship.universityImage || "/placeholder-university.jpg"}
              alt={scholarship.universityName}
              className="w-full h-60 object-cover rounded-lg"
            />
            <div className="flex flex-wrap gap-3">
              {scholarship.universityWorldRank && (
                <span className="badge badge-success gap-1 text-lg py-4">
                  <FaStar /> Rank #{scholarship.universityWorldRank}
                </span>
              )}
              <span className="badge badge-info text-lg py-4">
                {scholarship.scholarshipCategory}
              </span>
            </div>
            <h1 className="text-3xl font-bold">
              {scholarship.scholarshipName}
            </h1>
            <p className="flex items-center gap-2 text-gray-600">
              <FaUniversity />
              {scholarship.universityName}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
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
                scholarship.applicationDeadline
              ).toLocaleDateString()}
            />
            <InfoCard
              icon={<FaClock />}
              title="Posted On"
              value={new Date(
                scholarship.scholarshipPostDate
              ).toLocaleDateString()}
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {scholarship.scholarshipDescription || "No description provided."}
            </p>
          </div>
        </div>

        {/* RIGHT SIDEBAR*/}
        <div className="space-y-6">
          {/* Stipend */}
          {scholarship.stipendAmount && (
            <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-6">
              <p className="text-sm text-emerald-700">Monthly Stipend</p>
              <p className="text-3xl font-bold text-emerald-800">
                {scholarship.stipendAmount}
              </p>
            </div>
          )}
          {/* Reviews Carousel */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">
              Reviews ({reviews.length})
            </h2>

            {reviewsLoading ? (
              <p className="text-center text-gray-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-500">No reviews yet</p>
            ) : (
              <div className="relative">
                {/* Left Arrow */}
                <button
                  onClick={scrollLeft}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-green-100 shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
                  aria-label="Scroll left"
                >
                  <FaChevronLeft className="text-xl text-gray-600" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={scrollRight}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-green-100 shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
                  aria-label="Scroll right"
                >
                  <FaChevronRight className="text-xl text-gray-600" />
                </button>

                {/* Carousel Container */}
                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="min-w-full bg-gray-50 rounded-lg p-5 border flex gap-4"
                    >
                      <img
                        src={reviewUsers[review.userEmail] || "/avatar.png"}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold truncate">
                            {review.userName}
                          </h4>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {new Date(review.reviewDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 my-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < review.ratingPoint
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                              size={14}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {review.reviewComment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
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
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-2xl font-bold">
                $
                {(
                  (scholarship.tuitionFees || 0) +
                  (scholarship.applicationFees || 0) +
                  (scholarship.serviceCharge || 0)
                ).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <FaUserTie /> Posted By
            </h3>
            <p className="text-sm break-all">{scholarship.postedUserEmail}</p>
          </div>
          <button onClick={handleApply} className="btn btn-primary w-full">
            Apply Now
          </button>
          <Link to="/" className="btn btn-outline w-full">
            <FaArrowLeft /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow p-4 flex gap-3">
    <div className="text-primary text-xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const CostRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default ScholarshipDetails;
