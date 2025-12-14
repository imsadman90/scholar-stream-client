import { useQuery } from "@tanstack/react-query";
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

  // Check if current user owns the review
  const isOwner = (review) => {
    return user?.email === review.userEmail;
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
      <title>All Reviews | Scholar Stream</title>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          All Reviews ({reviews.length})
        </h1>

        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No reviews yet</h3>
            <p className="text-gray-600">
              Reviews from students will appear here.
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
                      Student
                    </th>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {review.userPhoto ? (
                            <img
                              src={review.userPhoto}
                              alt={review.userName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                              <FaUser className="text-gray-500" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {review.userName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {review.scholarshipName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {review.universityName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
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
                          <span className="text-sm font-semibold ml-2">
                            {review.ratingPoint}/5
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        <p className="line-clamp-2">{review.reviewComment}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(review.reviewDate)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {isOwner(review) ? (
                          <button
                            onClick={() => handleDelete(review)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
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
                  {/* Student Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    {review.userPhoto ? (
                      <img
                        src={review.userPhoto}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                        <FaUser className="text-gray-500" size={20} />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(review.reviewDate)}
                      </p>
                    </div>
                  </div>

                  {/* Scholarship Info */}
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-800">
                      {review.scholarshipName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {review.universityName}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 my-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.ratingPoint
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="text-sm font-medium ml-1">
                      {review.ratingPoint}/5
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 italic mb-3">
                    "{review.reviewComment}"
                  </p>

                  {/* Actions */}
                  {isOwner(review) && (
                    <div className="flex justify-end pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleDelete(review)}
                        className="text-red-600 flex items-center gap-2 hover:text-red-800"
                      >
                        <FaTrash size={18} />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AllReviews;
