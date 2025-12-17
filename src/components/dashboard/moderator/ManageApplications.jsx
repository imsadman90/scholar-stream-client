import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { BiDollar } from "react-icons/bi";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
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
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pt-8 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8">Manage Applications</h1>

          {/* Filters & Search */}
          <div className="bg-base-200 rounded-xl p-6 shadow-lg mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, university..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="select select-bordered"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                className="select select-bordered"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg p-4 text-center shadow-lg">
              <p className="text-sm opacity-90">Total</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-warning to-warning/80 text-white rounded-lg p-4 text-center shadow-lg">
              <p className="text-sm opacity-90">Pending</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-gradient-to-br from-info to-info/80 text-white rounded-lg p-4 text-center shadow-lg">
              <p className="text-sm opacity-90">Processing</p>
              <p className="text-3xl font-bold">{stats.processing}</p>
            </div>
            <div className="bg-gradient-to-br from-success to-success/80 text-white rounded-lg p-4 text-center shadow-lg">
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
            <div className="bg-gradient-to-br from-error to-error/80 text-white rounded-lg p-4 text-center shadow-lg">
              <p className="text-sm opacity-90">Rejected</p>
              <p className="text-3xl font-bold">{stats.rejected}</p>
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto bg-base-200 rounded-xl shadow-xl">
            <table className="table w-full min-w-5xl">
              <thead>
                <tr className="bg-primary text-white">
                  <th>Applicant</th>
                  <th>University</th>
                  <th>Degree / Category</th>
                  <th>Fees</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-base-300 transition">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar"></div>
                        <div>
                          <div className="font-bold">{app.userName}</div>
                          <div className="text-sm opacity-70">
                            {app.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold">{app.universityName}</td>
                    <td>
                      <div>
                        <div className="badge badge-sm badge-primary">
                          {app.degree}
                        </div>
                        <div className="text-md mt-1 opacity-70">
                          {app.scholarshipCategory}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <BiDollar />
                        <span className="font-bold">
                          {(app.applicationFees || 0) +
                            (app.serviceCharge || 0)}
                        </span>
                      </div>
                    </td>
                    <td>
                      {app.paymentStatus === "paid" ? (
                        <div className="flex items-center gap-1 text-success font-semibold">
                          <FaCheck />
                          <span className="text-md">Paid</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-error">
                          <FaTimes />
                          <span className="text-md font-semibold">Unpaid</span>
                        </div>
                      )}
                    </td>
                    <td className="min-w-31">
                      <select
                        className={`select select-sm w-full max-w-xs font-bold ${
                          app.applicationStatus === "completed"
                            ? "text-green-500"
                            : app.applicationStatus === "rejected"
                            ? "text-red-500"
                            : app.applicationStatus === "processing"
                            ? "text-blue-500"
                            : "text-yellow-500"
                        }`}
                        value={app.applicationStatus || "pending"}
                        onChange={(e) =>
                          handleStatusUpdate(app._id, e.target.value)
                        }
                      >
                        <option className="text-yellow-500" value="pending">
                          Pending
                        </option>
                        <option className="text-blue-500" value="processing">
                          Processing
                        </option>
                        <option className="text-green-500" value="completed">
                          Completed
                        </option>
                        <option className="text-red-500" value="rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td className="flex items-center">
                      <div className="flex">
                        <button
                          onClick={() => {
                            openViewDetailsModal(app);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="btn btn-ghost btn-md text-primary"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            openFeedbackModal(app);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="btn btn-ghost btn-md text-info"
                          title="Add Feedback"
                        >
                          <MdOutlineInsertComment />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="btn btn-ghost btn-md text-error"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No applications found</p>
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
