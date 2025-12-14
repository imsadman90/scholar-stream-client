import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useState } from "react";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <title>My Reviews | Scholar Stream</title>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Reviews ({reviews.length})
        </h1>

        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No reviews yet</h3>
            <p className="text-gray-600">
              Your reviews will appear here after you review scholarships.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Scholarship
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      University
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Comment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {review.scholarshipName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {review.universityName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="text-lg font-semibold">
                            {review.ratingPoint}
                          </span>
                          <span className="text-gray-500 text-sm">/ 5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 min-w-40">
                        {review.reviewComment}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(review.reviewDate)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(review)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(review)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-lg shadow p-6 border border-gray-200"
                >
                  <h3 className="font-bold text-lg text-gray-800">
                    {review.scholarshipName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {review.universityName}
                  </p>

                  <div className="flex items-center gap-2 my-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="text-sm font-medium ml-1">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="text-gray-700 italic mb-3">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {formatDate(review?.date)}
                    </span>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-blue-600"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
                        className="text-red-600"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative bg-white rounded-lg p-6 w-full max-w-md z-10">
            <h2 className="text-xl font-bold mb-4">Edit Review</h2>

            {/* Rating Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400 transition`}
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
              className="w-full p-3 border rounded-lg mb-4"
              rows="4"
              placeholder="Write your review..."
            />

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
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
