import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/shared/Loading";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, isRoleLoading] = useRole();
  const axiosSecure = useAxiosSecure();

  const {
    data: stats = {
      totalApplications: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      rejected: 0,
    },
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["dashboardStats", user?.email, role],
    enabled: !!user?.email && !authLoading && !isRoleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/application/dashboard/status`, {
        params: { email: user.email },
      });

      return res.data;
    },
  });

  // Recent Activities
  const { data: recentActivities = [], isLoading: activitiesLoading } =
    useQuery({
      queryKey: ["recentActivities", user?.email, role],
      enabled: !!user?.email && !!role,
      queryFn: async () => {
        const endpoint =
          role === "admin" || role === "moderator"
            ? "/application"
            : `/application/user/${user.email}`;
        const res = await axiosSecure.get(endpoint);
        const applications = Array.isArray(res.data) ? res.data : [];

        return applications
          .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
          .slice(0, 5);
      },
    });

  if (authLoading || isRoleLoading) return <LoadingSpinner />;

  const isStudent = role === "student";

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.displayName || "Scholar"}!
          </h1>
          <p className="text-base-content/70">
            {isStudent
              ? "Track your scholarship applications and progress."
              : "Manage applications and monitor platform activity."}
          </p>
        </div>

        {/* Stats Grid - Now with 5 cards including Rejected */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            color="from-primary to-primary/80"
            loading={statsLoading}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            color="from-warning to-warning/80"
            loading={statsLoading}
          />
          <StatCard
            title="In Processing"
            value={stats.processing}
            color="from-info to-info/80"
            loading={statsLoading}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            color="from-success to-success/80"
            loading={statsLoading}
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            color="from-error to-error/80"
            loading={statsLoading}
          />
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card bg-base-200 shadow-xl"
        >
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Recent Activity</h2>

            {activitiesLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-center py-8 text-base-content/60">
                {isStudent
                  ? "No applications yet. Start applying!"
                  : "No applications found."}
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-center gap-4 p-4 bg-base-100 rounded-lg hover:bg-base-200 transition"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        activity.applicationStatus === "completed"
                          ? "bg-success/10"
                          : activity.applicationStatus === "pending"
                          ? "bg-warning/10"
                          : activity.applicationStatus === "processing"
                          ? "bg-info/10"
                          : "bg-error/10"
                      }`}
                    >
                      {activity.applicationStatus === "completed" ? (
                        <FaCheckCircle className="text-success text-xl" />
                      ) : activity.applicationStatus === "pending" ? (
                        <FaClock className="text-warning text-xl" />
                      ) : activity.applicationStatus === "processing" ? (
                        <FaGraduationCap className="text-info text-xl" />
                      ) : (
                        <FaTimesCircle className="text-error text-xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${
                          activity.applicationStatus === "rejected"
                            ? "text-error"
                            : ""
                        }`}
                      >
                        {activity.applicationStatus === "completed"
                          ? "Application Completed"
                          : activity.applicationStatus === "pending"
                          ? "Application Pending"
                          : activity.applicationStatus === "processing"
                          ? "Application In Processing"
                          : activity.applicationStatus === "rejected"
                          ? "Application Rejected"
                          : "Status Unknown"}
                      </p>
                      <p className="text-sm text-base-content/60">
                        {activity.universityName} - {activity.scholarshipName}
                      </p>
                      {!isStudent && activity.userEmail && (
                        <p className="text-xs text-base-content/50 mt-1">
                          Applicant: {activity.userEmail}
                        </p>
                      )}
                    </div>
                    <span className="hidden md:inline text-sm text-base-content/60">
                      {new Date(
                        activity.appliedAt || activity.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Reusable StatCard Component
const StatCard = ({ title, value, icon, color, loading }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`card bg-gradient-to-br ${color} text-white shadow-xl`}
  >
    <div className="card-body">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <h3 className="text-4xl font-bold mt-2">
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              value || 0
            )}
          </h3>
        </div>
        <div className="text-5xl text-white/40">{icon}</div>
      </div>
    </div>
  </motion.div>
);

export default Dashboard;
