// src/pages/Dashboard.jsx  (Student Dashboard - Fixed Version)

import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaClock,
  FaGraduationCap,
  FaCheckCircle,
  FaUserGraduate,
  FaExclamationTriangle,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../shared/Loading";

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, isRoleLoading] = useRole();
  const axiosSecure = useAxiosSecure();

  // Fetch student's application statistics
  const { 
    data: stats = {}, 
    isLoading: statsLoading,
    error: statsError 
  } = useQuery({
    queryKey: ["studentStats", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/applications/stats");
      return res.data;
    },
    retry: 1,
    // Add default values on error
    onError: (error) => {
      console.error("Error fetching stats:", error);
    }
  });

  // Fetch recent applications
  const { 
    data: recentApps = [], 
    isLoading: recentLoading,
    error: recentError 
  } = useQuery({
    queryKey: ["recentApps", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/applications/recent?limit=5");
      return res.data;
    },
    retry: 1,
    onError: (error) => {
      console.error("Error fetching recent apps:", error);
    }
  });

  if (authLoading || isRoleLoading) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <FaExclamationTriangle className="text-6xl text-warning mb-4" />
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-base-content/70 mb-6">Please log in to access your dashboard</p>
        <a href="/" className="btn btn-primary">Go to Home</a>
      </div>
    );
  }

  const isStudent = role === "student";

  // Safe default values for stats
  const safeStats = {
    totalApplications: stats?.totalApplications || 0,
    pending: stats?.pending || 0,
    processing: stats?.processing || 0,
    approved: stats?.approved || 0
  };

  return (
    <div className="p-6 min-h-screen bg-base-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
            Welcome back, {user?.displayName?.split(" ")[0] || "Scholar"}!
          </h1>
          <p className="text-lg text-base-content/70">
            Track your scholarship journey and grow with the community
          </p>
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsError ? (
            <div className="col-span-full">
              <div className="alert alert-warning">
                <FaExclamationTriangle />
                <span>Unable to load statistics. Please try refreshing the page.</span>
              </div>
            </div>
          ) : statsLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              <StatCard
                title="Total Applications"
                value={safeStats.totalApplications}
                icon={<FaFileAlt className="text-4xl" />}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                title="Pending Review"
                value={safeStats.pending}
                icon={<FaClock className="text-4xl" />}
                color="from-orange-500 to-red-500"
              />
              <StatCard
                title="In Processing"
                value={safeStats.processing}
                icon={<FaGraduationCap className="text-4xl" />}
                color="from-purple-500 to-indigo-600"
              />
              <StatCard
                title="Approved"
                value={safeStats.approved}
                icon={<FaCheckCircle className="text-4xl" />}
                color="from-green-500 to-emerald-600"
              />
            </>
          )}
        </div>

        {/* Recent Applications */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 flex items-center gap-3">
              <FaUserGraduate className="text-primary" />
              Recent Applications
            </h2>

            {recentError ? (
              <div className="alert alert-warning">
                <FaExclamationTriangle />
                <span>Unable to load recent applications. Please try again later.</span>
              </div>
            ) : recentLoading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : recentApps.length === 0 ? (
              <div className="text-center py-12">
                <FaFileAlt className="mx-auto text-6xl text-base-300 mb-4" />
                <p className="text-xl text-base-content/60">
                  No applications yet. Start applying today!
                </p>
                <a href="/scholarships" className="btn btn-primary mt-6">
                  Browse Scholarships
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApps.map((app) => (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-5 bg-base-100 rounded-xl hover:shadow-lg transition-all"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        app.status === "approved"
                          ? "bg-success/20 text-success"
                          : app.status === "pending"
                          ? "bg-warning/20 text-warning"
                          : "bg-info/20 text-info"
                      }`}
                    >
                      {app.status === "approved" ? (
                        <FaCheckCircle className="text-2xl" />
                      ) : app.status === "pending" ? (
                        <FaClock className="text-2xl" />
                      ) : (
                        <FaGraduationCap className="text-2xl" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {app.scholarshipName || app.universityName}
                      </h3>
                      <p className="text-sm text-base-content/70">
                        {app.universityName} • Applied on{" "}
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`badge badge-lg font-medium ${
                          app.status === "approved"
                            ? "badge-success"
                            : app.status === "pending"
                            ? "badge-warning"
                            : "badge-info"
                        }`}
                      >
                        {app.status?.charAt(0).toUpperCase() +
                          app.status?.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/scholarships"
            className="btn btn-primary btn-lg shadow-lg"
          >
            Browse Scholarships
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/dashboard/my-applications"
            className="btn btn-outline btn-lg"
          >
            View All Applications
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/dashboard/my-reviews"
            className="btn btn-ghost btn-lg"
          >
            My Reviews
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.03 }}
    className={`card bg-gradient-to-br ${color} text-white shadow-2xl`}
  >
    <div className="card-body text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <p className="text-white/90 text-sm font-medium">{title}</p>
      <h3 className="text-5xl font-bold mt-2">{value}</h3>
    </div>
  </motion.div>
);

export default StudentDashboard;