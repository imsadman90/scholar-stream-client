import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
        (s) => s._id === app.scholarshipId,
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
        "error",
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
        "error",
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
        "warning",
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

  const statusBadge = (status) => {
    if (status === "completed")
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30";
    if (status === "rejected")
      return "bg-rose-500/15 text-rose-300 border border-rose-400/30";
    return "bg-amber-500/15 text-amber-200 border border-amber-300/30";
  };

  const paymentBadge = (status) => {
    if (status === "paid")
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30";
    return "bg-rose-500/15 text-rose-200 border border-rose-300/30";
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-cyan-400"></div>
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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-2">
                My Space
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
                My Scholarship Applications
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm text-cyan-200">
                  {applications.length} total
                </span>
              </h1>
              <p className="text-slate-400 mt-2">
                Track payments, statuses, and feedback for every submission.
              </p>
            </div>
            <Link
              to="/scholarships"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
            >
              Browse Scholarships
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-2xl">
              <h3 className="text-2xl font-semibold text-white mb-3">
                No applications yet
              </h3>
              <p className="text-slate-400 mb-6">
                Start exploring scholarships tailored for you and submit your
                first application.
              </p>
              <Link
                to="/scholarships"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
              >
                Find Scholarships
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              <div className="overflow-x-auto">
                <table className="table table-zebra-zebra w-full text-sm">
                  <thead className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 text-slate-100">
                    <tr>
                      <th className="font-semibold">University</th>
                      <th className="font-semibold">Degree</th>
                      <th className="font-semibold">Applied</th>
                      <th className="font-semibold">Fees</th>
                      <th className="font-semibold">Payment</th>
                      <th className="font-semibold">Pay</th>
                      <th className="font-semibold">Status</th>
                      <th className="font-semibold">Feedback</th>
                      <th className="font-semibold text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applicationsWithDetails.map((app) => {
                      const unpaid =
                        !app.paymentStatus || app.paymentStatus === "unpaid";

                      return (
                        <motion.tr
                          key={app._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                          className="hover:bg-white/5"
                        >
                          <td className="min-w-44">
                            <div className="font-semibold text-white">
                              {app.universityName}
                            </div>
                            <div className="text-xs text-slate-400">
                              {app.universityCity || "N/A"}
                            </div>
                          </td>
                          <td className="text-slate-200">
                            {app.degree || app.subjectCategory}
                          </td>
                          <td className="text-slate-200">
                            {formatDate(app.applicationDate)}
                          </td>
                          <td className="font-semibold text-cyan-200">
                            ${app.applicationFees}
                          </td>

                          <td>
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${paymentBadge(app.paymentStatus)}`}
                            >
                              {app.paymentStatus || "unpaid"}
                            </span>
                          </td>

                          <td>
                            {app.applicationStatus === "pending" && unpaid ? (
                              <Link
                                to={`/dashboard/payment-page/${app._id}`}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/30 hover:translate-y-[-1px] transition w-[80px]"
                              >
                                Pay now
                              </Link>
                            ) : (
                              <span className="text-emerald-300 font-semibold">
                                Paid
                              </span>
                            )}
                          </td>

                          <td>
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(app.applicationStatus)}`}
                            >
                              {app.applicationStatus}
                            </span>
                          </td>

                          <td className="min-w-44 text-slate-200">
                            {app.feedback ? (
                              <i className="text-slate-100">"{app.feedback}"</i>
                            ) : (
                              <span className="text-slate-500">
                                No feedback yet
                              </span>
                            )}
                          </td>

                          <td className="py-5">
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 justify-start md:justify-end">
                              <button
                                onClick={() => {
                                  setSelectedApp(app);
                                  setIsDetailsOpen(true);
                                }}
                                className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-slate-100 text-xs font-semibold hover:border-cyan-300/50 hover:text-white transition"
                              >
                                Details
                              </button>
                              {app.applicationStatus === "pending" && (
                                <button
                                  onClick={() => handleEditClick(app)}
                                  className="px-3 py-2 rounded-lg bg-amber-500/80 text-white text-xs font-semibold shadow-md hover:translate-y-[-1px] transition"
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
                                    className="px-3 py-2 rounded-lg bg-sky-500/80 text-white text-xs font-semibold shadow-md hover:translate-y-[-1px] transition"
                                  >
                                    Add Review
                                  </button>
                                )}
                              {app.applicationStatus === "completed" &&
                                app.reviewed && (
                                  <span className="text-emerald-300 font-semibold text-xs mt-1">
                                    Reviewed
                                  </span>
                                )}
                              {app.applicationStatus === "pending" && (
                                <button
                                  onClick={() => handleDelete(app._id)}
                                  className="px-3 py-2 rounded-lg bg-rose-500/80 text-white text-xs font-semibold shadow-md hover:translate-y-[-1px] transition"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* View Details Modal */}
          {isDetailsOpen && selectedApp && (
            <dialog className="modal modal-open">
              <div className="modal-box w-11/12 max-w-3xl max-h-screen overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 border border-white/10 shadow-2xl">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {selectedApp.universityName} – Application Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white/5 border border-white/10 rounded-xl p-4">
                  <p>
                    <span className="text-slate-400">Degree:</span>{" "}
                    {selectedApp.degree}
                  </p>
                  <p>
                    <span className="text-slate-400">Applied on:</span>{" "}
                    {formatDate(selectedApp.applicationDate)}
                  </p>
                  <p>
                    <span className="text-slate-400">Fees:</span> $
                    {selectedApp.applicationFees}
                  </p>
                  <p>
                    <span className="text-slate-400">Payment Status:</span>{" "}
                    {selectedApp.paymentStatus || "unpaid"}
                  </p>
                  <p>
                    <span className="text-slate-400">Status:</span>{" "}
                    {selectedApp.applicationStatus}
                  </p>
                  <p>
                    <span className="text-slate-400">Feedback:</span>{" "}
                    {selectedApp.feedback || "No feedback yet"}
                  </p>
                  <p>
                    <span className="text-slate-400">University City:</span>{" "}
                    {selectedApp.universityCity || "N/A"}
                  </p>
                  <p>
                    <span className="text-slate-400">University Country:</span>{" "}
                    {selectedApp.universityCountry || "N/A"}
                  </p>
                </div>

                <div className="modal-action mt-6">
                  <button
                    className="px-4 py-2 rounded-lg border border-white/20 text-slate-100 hover:border-cyan-400/50 hover:text-white transition"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          )}

          {/* Edit Modal */}
          {isEditOpen && selectedApp && (
            <dialog className="modal modal-open">
              <div className="modal-box w-11/12 max-w-4xl h-[620px] overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-semibold mb-6 text-center text-white">
                  Edit Application – {selectedApp.universityName}
                </h3>

                {/* Scholarship Info - Read Only */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-xl mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-white">
                    Scholarship Details
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-200">
                    <p>
                      <span className="text-slate-400">University:</span>{" "}
                      {selectedApp.universityName}
                    </p>
                    <p>
                      <span className="text-slate-400">Degree:</span>{" "}
                      {selectedApp.degree}
                    </p>
                    <p>
                      <span className="text-slate-400">Category:</span>{" "}
                      {selectedApp.scholarshipCategory}
                    </p>
                    <p>
                      <span className="text-slate-400">Fee:</span> $
                      {selectedApp.applicationFees + selectedApp.serviceCharge}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Object.entries(editForm).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        {key.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={key === "dateOfBirth" ? "date" : "text"}
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-100 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
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
                    className="px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
                    onClick={handleSubmitEdit}
                    disabled={editMutation.isPending}
                  >
                    {editMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    className="px-4 py-3 rounded-lg border border-white/20 text-slate-100 hover:border-rose-400/50 hover:text-white transition"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </dialog>
          )}

          {isReviewOpen && selectedApp && (
            <dialog className="modal modal-open">
              <div className="modal-box w-11/12 max-w-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-semibold mb-6 text-center text-white">
                  Write a Review
                </h3>

                {/* Scholarship Info */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
                  <div className="flex items-center gap-4">
                    {selectedApp.universityImage && (
                      <img
                        src={selectedApp.universityImage}
                        alt={selectedApp.universityName}
                        className="w-16 h-16 rounded-lg object-cover border border-white/10"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-lg text-white">
                        {selectedApp.universityName}
                      </h4>
                      <p className="text-sm text-slate-300">
                        {selectedApp.scholarshipName || selectedApp.degree}
                      </p>
                      <p className="text-xs text-slate-400">
                        {selectedApp.universityCity},{" "}
                        {selectedApp.universityCountry}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3 text-slate-200">
                    Rating <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-4xl transition-all hover:scale-110 ${
                          star <= rating ? "text-amber-300" : "text-slate-500"
                        } hover:text-amber-300`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-3 text-lg font-semibold text-slate-100">
                      {rating}/5
                    </span>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-slate-200">
                    Your Review <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-32 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-100 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                    placeholder="Share your experience with this scholarship program..."
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {comment.length} / 500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="modal-action">
                  <button
                    className="px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
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
                    className="px-4 py-3 rounded-lg border border-white/20 text-slate-100 hover:border-rose-400/50 hover:text-white transition"
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
      </div>
    </>
  );
};

export default MyApplications;
