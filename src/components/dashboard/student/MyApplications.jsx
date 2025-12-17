import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const MyApplications = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Edit form
  const [editForm, setEditForm] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    currentEducationLevel: "",
    institution: "",
    gpa: "",
    fieldOfStudy: "",
  });

  // GET applications
  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myApplications", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/application/user/${user.email}`);
      return res.data;
    },
  });

  const { data: allScholarships = [] } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships");
      return res.data;
    },
  });

  // Merge application + scholarship data efficiently
  const applicationsWithDetails = useMemo(() => {
    return applications.map((app) => {
      const scholarship = allScholarships.find(
        (s) => s._id === app.scholarshipId
      );
      return {
        ...app,
        universityCity: scholarship?.universityCity || "N/A",
        universityCountry: scholarship?.universityCountry || "N/A",
        universityImage: scholarship?.universityImage,
        scholarshipName: scholarship?.scholarshipName,
        scholarshipCategory: scholarship?.scholarshipCategory || "N/A",
      };
    });
  }, [applications, allScholarships]);

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/application/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myApplications", user?.email]);
      Swal.fire("Deleted!", "Application deleted successfully.", "success");
    },
  });

  // REVIEW
  const reviewMutation = useMutation({
    mutationFn: (reviewData) =>
      axiosSecure.patch(`/application/${selectedApp._id}/review`, {
        rating: reviewData.rating,
        comment: reviewData.comment,
        userEmail: user.email,
        userName: user.name,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["myApplications", user?.email]);
      queryClient.invalidateQueries(["reviews", selectedApp.scholarshipId]); // optional

      setIsReviewOpen(false);
      setRating(5);
      setComment("");

      Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: "Your review has been submitted successfully!",
        timer: 2500,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to submit review",
        "error"
      );
    },
  });

  // EDIT MUTATION
  const editMutation = useMutation({
    mutationFn: (updateData) =>
      axiosSecure.patch(`/application/${selectedApp._id}`, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(["myApplications", user?.email]);
      setIsEditOpen(false);
      Swal.fire("Updated!", "Application updated successfully.", "success");
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to update",
        "error"
      );
    },
  });

  // Handle Edit
  const handleEditClick = (app) => {
    setSelectedApp(app);
    setEditForm({
      phone: app.phone || "",
      dateOfBirth: app.dateOfBirth ? app.dateOfBirth.split("T")[0] : "",
      gender: app.gender || "",
      address: app.address || "",
      city: app.city || "",
      country: app.country || "",
      currentEducationLevel: app.currentEducationLevel || "",
      institution: app.institution || "",
      gpa: app.gpa || "",
      fieldOfStudy: app.fieldOfStudy || "",
    });
    setIsEditOpen(true);
  };

  // Submit Edit with validation
  const handleSubmitEdit = () => {
    const required = ["phone", "gender", "address", "city", "country"];
    for (let field of required) {
      if (!editForm[field]?.trim()) {
        return Swal.fire("Required!", `${field} is required.`, "warning");
      }
    }
    editMutation.mutate(editForm);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Application?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((res) => {
      if (res.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      return Swal.fire("Required", "Please write a comment", "warning");
    }
    if (comment.length > 500) {
      return Swal.fire(
        "Too Long",
        "Review must be under 500 characters",
        "warning"
      );
    }

    reviewMutation.mutate({ rating, comment });
  };

  const formatDate = (dateString) => {
    try {
      return dateString ? format(new Date(dateString), "dd MMM yyyy") : "N/A";
    } catch {
      return "Invalid Date";
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        Failed to load applications: {error.message}
      </div>
    );
  }

  return (
    <>
      <title>My Applications | Scholar Stream</title>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Scholarship Applications ({applications.length})
        </h1>

        {applications.length === 0 ? (
          <div className="text-center bg-gray-50 py-20 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-3">No applications yet</h3>
            <button
              onClick={() => (window.location.href = "/scholarships")}
              className="btn btn-primary"
            >
              Browse Scholarships
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="table w-full">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th>University</th>
                  <th>Degree</th>
                  <th>Applied</th>
                  <th>Fees</th>
                  <th>Payment</th>
                  <th>Pay</th>
                  <th>Status</th>
                  <th>Feedback</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {applicationsWithDetails.map((app) => {
                  const unpaid =
                    !app.paymentStatus || app.paymentStatus === "unpaid";

                  return (
                    <tr key={app._id} className="hover">
                      <td className="text-nowrap">
                        <p className="font-semibold">{app.universityName}</p>
                        <p className="text-xs text-gray-500">
                          {app.universityCity || "N/A"}
                        </p>
                      </td>
                      <td>{app.degree || app.subjectCategory}</td>
                      <td className="min-w-30">
                        {formatDate(app.applicationDate)}
                      </td>
                      <td className="font-semibold">${app.applicationFees}</td>

                      <td>
                        <span
                          className={`text-md rounded-full ${
                            app.paymentStatus === "paid"
                              ? "font-semibold text-green-700"
                              : "font-semibold text-red-700"
                          }`}
                        >
                          {app.paymentStatus || "unpaid"}
                        </span>
                      </td>

                      <td>
                        {app.applicationStatus === "pending" && unpaid ? (
                          <Link
                            to={`/dashboard/payment-page/${app._id}`}
                            className="btn btn-success btn-sm text-white"
                          >
                            Pay
                          </Link>
                        ) : (
                          <span className="text-green-700 font-semibold">
                            Paid
                          </span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            app.applicationStatus === "completed"
                              ? "bg-green-100 text-green-700 font-semibold"
                              : app.applicationStatus === "rejected"
                              ? "bg-red-100 text-red-700 font-semibold"
                              : "bg-yellow-100 text-yellow-700 font-semibold"
                          }`}
                        >
                          {app.applicationStatus}
                        </span>
                      </td>

                      <td className="min-w-40">
                        {app.feedback ? (
                          <i>"{app.feedback}"</i>
                        ) : (
                          <span className="text-gray-400">No feedback yet</span>
                        )}
                      </td>

                      <td className="flex gap-3 py-5">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setIsDetailsOpen(true);
                          }}
                          className="btn btn-sm"
                        >
                          Details
                        </button>
                        {app.applicationStatus === "pending" && (
                          <button
                            onClick={() => handleEditClick(app)}
                            className="btn btn-sm btn-warning text-white"
                          >
                            Edit
                          </button>
                        )}
                        {app.applicationStatus === "completed" &&
                          !app.reviewed && (
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setIsReviewOpen(true);
                              }}
                              className="btn btn-info btn-sm text-white"
                            >
                              Add Review
                            </button>
                          )}
                        {app.applicationStatus === "completed" &&
                          app.reviewed && (
                            <span className="text-green-600 font-semibold mt-1">
                              Reviewed
                            </span>
                          )}
                        {app.applicationStatus === "pending" && (
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="btn btn-error btn-sm text-white"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* View Details Modal */}
        {isDetailsOpen && selectedApp && (
          <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-3xl max-h-screen overflow-y-auto">
              <h3 className="font-bold text-2xl mb-4 text-primary">
                {selectedApp.universityName} – Application Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Degree:</strong> {selectedApp.degree}
                </p>
                <p>
                  <strong>Applied on:</strong>{" "}
                  {formatDate(selectedApp.applicationDate)}
                </p>
                <p>
                  <strong>Fees:</strong> ${selectedApp.applicationFees}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {selectedApp.paymentStatus || "unpaid"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedApp.applicationStatus}
                </p>
                <p>
                  <strong>Feedback:</strong>{" "}
                  {selectedApp.feedback || "No feedback yet"}
                </p>
                <p>
                  <strong>University City:</strong>{" "}
                  {selectedApp.universityCity || "N/A"}
                </p>
                <p>
                  <strong>University Country:</strong>{" "}
                  {selectedApp.universityCountry || "N/A"}
                </p>
              </div>

              <div className="modal-action mt-4">
                <button className="btn" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* Edit Modal */}
        {isEditOpen && selectedApp && (
          <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-4xl h-[600px]  overflow-y-auto">
              <h3 className="font-bold text-2xl mb-6 text-center text-primary">
                Edit Application – {selectedApp.universityName}
              </h3>

              {/* Scholarship Info - Read Only */}
              <div className="bg-base-200 p-5 rounded-lg mb-4 mb-6">
                <h4 className="font-bold text-lg mb-3">Scholarship Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <p>
                    <strong>University:</strong> {selectedApp.universityName}
                  </p>
                  <p>
                    <strong>Degree:</strong> {selectedApp.degree}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedApp.scholarshipCategory}
                  </p>
                  <p>
                    <strong>Fee:</strong> $
                    {selectedApp.applicationFees + selectedApp.serviceCharge}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Form inputs */}
                {Object.entries(editForm).map(([key, value]) => (
                  <div key={key}>
                    <label className="label">
                      <span className="label-text font-medium">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                    </label>
                    <input
                      type={key === "dateOfBirth" ? "date" : "text"}
                      className="input input-bordered w-full"
                      value={value}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="modal-action mt-8">
                <button
                  className="btn btn-success text-white"
                  onClick={handleSubmitEdit}
                  disabled={editMutation.isPending}
                >
                  {editMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
                <button className="btn" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </dialog>
        )}

        {isReviewOpen && selectedApp && (
          <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
              <h3 className="font-bold text-2xl mb-6 text-center text-primary">
                Write a Review
              </h3>

              {/* Scholarship Info */}
              <div className="bg-base-200 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-4">
                  {selectedApp.universityImage && (
                    <img
                      src={selectedApp.universityImage}
                      alt={selectedApp.universityName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-lg">
                      {selectedApp.universityName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedApp.scholarshipName || selectedApp.degree}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedApp.universityCity},{" "}
                      {selectedApp.universityCountry}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-all hover:scale-110 ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-400`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-3 text-lg font-semibold text-gray-700">
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Comment Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Share your experience with this scholarship program..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length} / 500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="modal-action">
                <button
                  className="btn btn-success text-white"
                  onClick={handleSubmitReview}
                  disabled={reviewMutation.isPending || !comment.trim()}
                >
                  {reviewMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setIsReviewOpen(false);
                    setRating(5);
                    setComment("");
                  }}
                  disabled={reviewMutation.isPending}
                >
                  Cancel
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </>
  );
};

export default MyApplications;
