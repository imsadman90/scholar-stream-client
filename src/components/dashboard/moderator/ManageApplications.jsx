import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { BiDollar } from "react-icons/bi";
import { FaSearch, FaEye, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ViewDetailsModal from "../moderator/ViewDetailsModal";
import FeedbackModal from "../moderator/FeedBackModal";
import { MdOutlineInsertComment } from "react-icons/md";

const ManageApplications = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);

  const {
    data: applications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["manageApplications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/application");
      return res.data;
    },
  });

  // Status Update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/application/${id}/status`, {
        status: newStatus,
      });

      queryClient.invalidateQueries({ queryKey: ["manageApplications"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

      toast.success("Status updated successfully!");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Feedback Submit
  const handleFeedbackSubmit = async (feedback) => {
    if (!feedback.trim()) return toast.error("Feedback is required");

    try {
      await axiosSecure.patch(`/application/${selectedApp._id}/feedback`, {
        feedback,
      });

      queryClient.invalidateQueries({ queryKey: ["manageApplications"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });

      toast.success("Feedback added!");
      setFeedbackModal(false);
      setSelectedApp(null);
    } catch (err) {
      toast.error("Failed to submit feedback");
    }
  };

  // Delete Application
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/application/${id}`);

        queryClient.invalidateQueries({ queryKey: ["manageApplications"] });
        queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
        queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

        Swal.fire("Deleted!", "Application has been removed.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete application.", "error");
      }
    }
  };

  // Modal Handlers
  const openFeedbackModal = (app) => {
    setSelectedApp(app);
    setFeedbackModal(true);
  };

  const openViewDetailsModal = (app) => {
    setSelectedApp(app);
    setViewDetailsModal(true);
  };

  const closeViewDetailsModal = () => {
    setSelectedApp(null);
    setViewDetailsModal(false);
  };

  const closeFeedbackModal = () => {
    setSelectedApp(null);
    setFeedbackModal(false);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      (app.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.userEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.universityName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || app.applicationStatus === filterStatus;
    const matchesCategory =
      filterCategory === "all" || app.scholarshipCategory === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.applicationStatus === "pending")
      .length,
    processing: applications.filter((a) => a.applicationStatus === "processing")
      .length,
    completed: applications.filter((a) => a.applicationStatus === "completed")
      .length,
    rejected: applications.filter((a) => a.applicationStatus === "rejected")
      .length,
  };

  const categories = [
    ...new Set(applications.map((a) => a.scholarshipCategory).filter(Boolean)),
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 pt-8 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-6 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                Moderator
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Manage Applications
              </h1>
              <p className="text-slate-400 mt-1">
                Review, update statuses, and leave feedback.
              </p>
            </div>

            {/* Filters & Search */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, university..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-slate-100 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option className="bg-slate-900" value="all">
                    All Status
                  </option>
                  <option className="bg-slate-900" value="pending">
                    Pending
                  </option>
                  <option className="bg-slate-900" value="processing">
                    Processing
                  </option>
                  <option className="bg-slate-900" value="completed">
                    Completed
                  </option>
                  <option className="bg-slate-900" value="rejected">
                    Rejected
                  </option>
                </select>

                <select
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-slate-100 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option className="bg-slate-900" value="all">
                    All Categories
                  </option>
                  {categories.map((cat) => (
                    <option className="bg-slate-900" key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard
                label="Total"
                value={stats.total}
                tone="from-cyan-500/80 via-cyan-500 to-emerald-500"
              />
              <StatCard
                label="Pending"
                value={stats.pending}
                tone="from-amber-500/80 via-amber-500 to-orange-500"
              />
              <StatCard
                label="Processing"
                value={stats.processing}
                tone="from-blue-500/80 via-blue-500 to-cyan-400"
              />
              <StatCard
                label="Completed"
                value={stats.completed}
                tone="from-emerald-500/80 via-emerald-500 to-teal-400"
              />
              <StatCard
                label="Rejected"
                value={stats.rejected}
                tone="from-rose-500/80 via-rose-500 to-orange-500"
              />
            </div>
          </div>

          {/* Applications Table (keep horizontal scroll) */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <table className="table w-full min-w-5xl text-slate-100">
              <thead>
                <tr className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">University</th>
                  <th className="px-4 py-3">Degree / Category</th>
                  <th className="px-4 py-3">Fees</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredApplications.map((app, idx) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: idx * 0.015 }}
                    className="hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm font-semibold text-white">
                          {(app.userName || "?").slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {app.userName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {app.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-100">
                      {app.universityName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-200 border border-cyan-400/30 text-xs w-fit">
                          {app.degree}
                        </span>
                        <span className="text-sm text-slate-300">
                          {app.scholarshipCategory}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-emerald-200 font-semibold">
                        <BiDollar />
                        {(
                          Number(app.applicationFees || 0) +
                          Number(app.serviceCharge || 0)
                        ).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {app.paymentStatus === "paid" ? (
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-200 border border-emerald-400/30 text-sm font-semibold">
                          <FaCheck /> Paid
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-200 border border-rose-400/30 text-sm font-semibold">
                          <FaTimes /> Unpaid
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 min-w-31">
                      <select
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                        value={app.applicationStatus || "pending"}
                        onChange={(e) =>
                          handleStatusUpdate(app._id, e.target.value)
                        }
                      >
                        <option
                          className="bg-slate-900 text-amber-300"
                          value="pending"
                        >
                          Pending
                        </option>
                        <option
                          className="bg-slate-900 text-blue-300"
                          value="processing"
                        >
                          Processing
                        </option>
                        <option
                          className="bg-slate-900 text-emerald-300"
                          value="completed"
                        >
                          Completed
                        </option>
                        <option
                          className="bg-slate-900 text-rose-300"
                          value="rejected"
                        >
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            openViewDetailsModal(app);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 transition"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            openFeedbackModal(app);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 transition"
                          title="Add Feedback"
                        >
                          <MdOutlineInsertComment />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                No applications found
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ViewDetailsModal
        isOpen={viewDetailsModal}
        onClose={closeViewDetailsModal}
        application={selectedApp}
      />

      <FeedbackModal
        isOpen={feedbackModal}
        onClose={closeFeedbackModal}
        onSubmit={handleFeedbackSubmit}
        application={selectedApp}
      />
    </div>
  );
};

export default ManageApplications;

const StatCard = ({ label, value, tone }) => (
  <div
    className={`rounded-2xl bg-gradient-to-br ${tone} text-white shadow-2xl p-[1px]`}
  >
    <div className="rounded-2xl bg-slate-950/70 px-4 py-4 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-white/70">
        {label}
      </p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  </div>
);
