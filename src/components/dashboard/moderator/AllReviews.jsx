import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";
import { FaStar, FaTrash, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";

const AllReviews = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: reviews = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews`);
      return res.data;
    },
  });

  // Fetch user role to check if moderator
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data.role;
    },
    enabled: !!user?.email,
  });

  const handleDelete = (review) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/reviews/${review._id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", "The review has been deleted.", "success");
          }
        });
      }
    });
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return "Invalid date";
    }

    return format(parsed, "dd MMM yyyy");
  };

  // Check if current user can delete (owner OR moderator)
  const canDelete = (review) => {
    const isOwner = user?.email === review.userEmail;
    const isModerator = userRole === "moderator" || userRole === "student";
    return isOwner || isModerator;
  };

  if (isLoading || authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-cyan-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <title>All Reviews | Scholar Stream</title>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 lg:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                Moderator
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                All Reviews
              </h1>
              <p className="text-slate-400 mt-1">
                Browse, moderate, and remove student feedback.
              </p>
            </div>
            <div className="px-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur text-cyan-200 shadow-lg">
              <span className="text-xs uppercase tracking-[0.2em]">Total</span>
              <div className="text-2xl font-semibold">{reviews.length}</div>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No reviews yet
              </h3>
              <p className="text-slate-400">
                Reviews from students will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                <table className="w-full table-auto text-slate-100">
                  <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-[0.1em] text-slate-300">
                    <tr>
                      <th className="px-5 py-3 text-left">Student</th>
                      <th className="px-5 py-3 text-left">Scholarship</th>
                      <th className="px-5 py-3 text-left">University</th>
                      <th className="px-5 py-3 text-left">Rating</th>
                      <th className="px-5 py-3 text-left">Comment</th>
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reviews.map((review, idx) => (
                      <motion.tr
                        key={review._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: idx * 0.02 }}
                        className="hover:bg-white/5"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {review.userPhoto ? (
                              <img
                                src={review.userPhoto}
                                alt={review.userName}
                                className="w-10 h-10 rounded-full object-cover border border-white/20"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                <FaUser className="text-slate-300" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {review.userName}
                              </p>
                              <p className="text-xs text-slate-400">
                                {review.userEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-white">
                          {review.scholarshipName}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-300">
                          {review.universityName}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < review.ratingPoint
                                    ? "text-amber-300"
                                    : "text-slate-600"
                                }
                                size={14}
                              />
                            ))}
                            <span className="text-sm font-semibold ml-2 text-white">
                              {review.ratingPoint}/5
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-300 max-w-xs">
                          <p className="line-clamp-2">{review.reviewComment}</p>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-300">
                          {formatDate(review.reviewDate)}
                        </td>
                        <td className="px-5 py-3 text-sm">
                          {canDelete(review) ? (
                            <button
                              onClick={() => handleDelete(review)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 transition"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          ) : (
                            <span className="text-slate-500 text-xs">-</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="block md:hidden space-y-4">
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                      {review.userPhoto ? (
                        <img
                          src={review.userPhoto}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover border border-white/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                          <FaUser className="text-slate-300" size={18} />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white">
                          {review.userName}
                        </p>
                        <p className="text-xs font-medium text-slate-300 bg-white/10 inline-block px-2 py-1 rounded mt-1">
                          {formatDate(review.reviewDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-white">
                        {review.scholarshipName}
                      </h3>
                      <p className="text-sm text-slate-300">
                        {review.universityName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 my-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.ratingPoint
                              ? "text-amber-300"
                              : "text-slate-600"
                          }
                        />
                      ))}
                      <span className="text-sm font-medium ml-1 text-white">
                        {review.ratingPoint}/5
                      </span>
                    </div>

                    <p className="text-slate-200/90 italic mb-3">
                      "{review.reviewComment}"
                    </p>

                    {canDelete(review) && (
                      <div className="flex justify-end pt-3 border-t border-white/10">
                        <button
                          onClick={() => handleDelete(review)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-400/40 text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 transition"
                        >
                          <FaTrash size={16} />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllReviews;
