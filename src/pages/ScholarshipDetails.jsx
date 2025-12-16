import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const scrollRef = useRef(null);

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewUsers, setReviewUsers] = useState({});
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user?.email || !id) {
        setCheckingApplication(false);
        return;
      }
      try {
        const res = await axiosSecure.get(
          `/application/check/${id}/${user.email}`
        );
        setHasApplied(res.data.hasApplied);
      } finally {
        setCheckingApplication(false);
      }
    };
    checkExistingApplication();
  }, [id, user?.email, axiosSecure]);

  const handleApply = () => {
    if (!user) {
      toast.error("Please login to apply");
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosSecure.get(`/reviews/scholarship/${id}`);
        setReviews(res.data);
        const emails = [...new Set(res.data.map((r) => r.userEmail))];
        const users = await Promise.all(
          emails.map((e) => axiosSecure.get(`/users/${e}`))
        );
        const map = {};
        users.forEach((u) => (map[u.data.email] = u.data.photoURL));
        setReviewUsers(map);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id, axiosSecure]);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const res = await axiosSecure.get(`/scholarships/${id}`);
        setScholarship(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [id, axiosSecure]);

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
        <Link to="/all-scholarships" className="btn btn-primary">
          Browse Scholarships
        </Link>
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
        <div className="lg:col-span-2 space-y-6">
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
              <FaUniversity /> {scholarship.universityName}
            </p>
          </div>

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

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {scholarship.scholarshipDescription || "No description provided."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {scholarship.stipendAmount && (
            <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-6">
              <p className="text-sm text-emerald-700">Monthly Stipend</p>
              <p className="text-3xl font-bold text-emerald-800">
                {scholarship.stipendAmount}
              </p>
            </div>
          )}

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
                <button
                  onClick={scrollLeft}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-green-100 shadow-lg rounded-full p-2"
                >
                  <FaChevronLeft />
                </button>

                <button
                  onClick={scrollRight}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-green-100 shadow-lg rounded-full p-2"
                >
                  <FaChevronRight />
                </button>

                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto gap-6 pb-4 scroll-smooth"
                >
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="min-w-full bg-gray-50 rounded-lg p-5 border flex gap-4"
                    >
                      <img
                        src={reviewUsers[review.userEmail] || "/avatar.png"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold">{review.userName}</h4>
                          <span className="text-xs text-gray-400">
                            {new Date(review.reviewDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-1 my-2">
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
                        <p className="text-sm text-gray-700">
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

          {checkingApplication ? (
            <button className="btn btn-disabled w-full">Checking...</button>
          ) : hasApplied ? (
            <button className="btn btn-success w-full" disabled>
              Applied
            </button>
          ) : (
            <button onClick={handleApply} className="btn btn-primary w-full">
              Apply Now
            </button>
          )}

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
