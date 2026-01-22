import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useState } from "react";
import { motion } from "framer-motion";

const MyReviews = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingReview, setEditingReview] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const {
    data: reviews = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myReviews", user?.email],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user/${user?.email}`);
      return res.data;
    },
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
            Swal.fire("Deleted!", "Your review has been deleted.", "success");
          }
        });
      }
    });
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setComment(review.reviewComment);
    setRating(review.ratingPoint);
  };

  const handleUpdate = () => {
    if (!comment.trim()) return;

    axiosSecure
      .patch(`/reviews/${editingReview._id}`, {
        reviewComment: comment,
        ratingPoint: rating,
      })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          setEditingReview(null);
          Swal.fire("Updated!", "Your review has been updated.", "success");
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

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <>
      <title>My Reviews | Scholar Stream</title>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-2">
                My Space
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
                My Reviews
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm text-cyan-200">
                  {reviews.length} total
                </span>
              </h1>
              <p className="text-slate-400 mt-2">
                Manage the feedback you have left across scholarships.
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-2xl">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                No reviews yet
              </h3>
              <p className="text-slate-400">
                Your reviews will appear here after you share feedback on
                scholarships.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full table-zebra-zebra">
                    <thead className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 text-slate-100 text-sm">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">
                          Scholarship
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          University
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Rating
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Comment
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review) => (
                        <motion.tr
                          key={review._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                          className="hover:bg-white/5"
                        >
                          <td className="px-6 py-4 font-semibold text-white min-w-48">
                            {review.scholarshipName}
                          </td>
                          <td className="px-6 py-4 text-slate-200 min-w-40">
                            {review.universityName}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-100">
                              <span className="text-lg font-semibold text-amber-300">
                                {review.ratingPoint}
                              </span>
                              <span className="text-slate-400 text-sm">
                                / 5
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-200 min-w-64">
                            {review.reviewComment}
                          </td>
                          <td className="px-6 py-4 text-slate-300 min-w-32">
                            {formatDate(review.reviewDate)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(review)}
                                className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-cyan-200 text-xs font-semibold hover:border-cyan-300/50 hover:text-white transition"
                              >
                                <span className="flex items-center gap-2">
                                  <FaEdit /> Edit
                                </span>
                              </button>
                              <button
                                onClick={() => handleDelete(review)}
                                className="px-3 py-2 rounded-lg bg-rose-500/80 text-white text-xs font-semibold shadow-md hover:translate-y-[-1px] transition"
                              >
                                <span className="flex items-center gap-2">
                                  <FaTrash /> Delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="block md:hidden space-y-4">
                {reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl"
                  >
                    <h3 className="font-semibold text-lg text-white">
                      {review.scholarshipName}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {review.universityName}
                    </p>

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
                      <span className="text-sm font-medium ml-1 text-slate-200">
                        {review.ratingPoint}/5
                      </span>
                    </div>

                    <p className="text-slate-200 italic mb-3">
                      "{review.reviewComment}"
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-xs text-slate-500">
                        {formatDate(review?.reviewDate)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(review)}
                          className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-cyan-200 text-xs font-semibold hover:border-cyan-300/50 hover:text-white transition"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(review)}
                          className="px-3 py-2 rounded-lg bg-rose-500/80 text-white text-xs font-semibold shadow-md hover:translate-y-[-1px] transition"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 rounded-2xl border border-white/10 p-6 w-full max-w-md z-10 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Edit Review
            </h2>

            {/* Rating Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-200">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl ${
                      star <= rating ? "text-amber-300" : "text-slate-600"
                    } hover:text-amber-300 transition`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-slate-100 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none mb-4"
              rows="4"
              placeholder="Write your review..."
            />

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 rounded-lg border border-white/20 text-slate-100 hover:border-rose-400/50 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
              >
                Update Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyReviews;
