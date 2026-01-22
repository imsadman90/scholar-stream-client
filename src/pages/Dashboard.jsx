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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                Dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome back, {user?.displayName || "Scholar"}!
              </h1>
              <p className="text-slate-400 mt-1">
                {isStudent
                  ? "Track your scholarship applications and progress."
                  : "Manage applications and monitor platform activity."}
              </p>
            </div>
            <div className="px-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur text-cyan-200 shadow-lg w-full sm:w-auto">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Role
              </p>
              <p className="text-lg font-semibold text-white capitalize">
                {role || "User"}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mb-8">
            <StatCard
              title="Total Applications"
              value={stats.totalApplications}
              color="from-cyan-500/80 via-cyan-500 to-emerald-500"
              loading={statsLoading}
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              color="from-amber-500/80 via-amber-500 to-orange-500"
              loading={statsLoading}
            />
            <StatCard
              title="In Processing"
              value={stats.processing}
              color="from-indigo-500/80 via-indigo-500 to-cyan-400"
              loading={statsLoading}
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              color="from-emerald-500/80 via-emerald-500 to-teal-400"
              loading={statsLoading}
            />
            <StatCard
              title="Rejected"
              value={stats.rejected}
              color="from-rose-500/80 via-rose-500 to-orange-500"
              loading={statsLoading}
            />
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
          >
            <div className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Recent Activity
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200">
                  Last 5 entries
                </span>
              </div>

              {activitiesLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg text-cyan-400"></span>
                </div>
              ) : recentActivities.length === 0 ? (
                <p className="text-center py-8 text-slate-300">
                  {isStudent
                    ? "No applications yet. Start applying!"
                    : "No applications found."}
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity, idx) => (
                    <motion.div
                      key={activity._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: idx * 0.02 }}
                      className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${
                          activity.applicationStatus === "completed"
                            ? "bg-emerald-500/15"
                            : activity.applicationStatus === "pending"
                              ? "bg-amber-500/15"
                              : activity.applicationStatus === "processing"
                                ? "bg-cyan-500/15"
                                : "bg-rose-500/15"
                        }`}
                      >
                        {activity.applicationStatus === "completed" ? (
                          <FaCheckCircle className="text-emerald-300 text-xl" />
                        ) : activity.applicationStatus === "pending" ? (
                          <FaClock className="text-amber-300 text-xl" />
                        ) : activity.applicationStatus === "processing" ? (
                          <FaGraduationCap className="text-cyan-300 text-xl" />
                        ) : (
                          <FaTimesCircle className="text-rose-300 text-xl" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold ${
                            activity.applicationStatus === "rejected"
                              ? "text-rose-300"
                              : "text-white"
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
                        <p className="text-sm text-slate-300 truncate">
                          {activity.universityName} - {activity.scholarshipName}
                        </p>
                        {!isStudent && activity.userEmail && (
                          <p className="text-xs text-slate-400 mt-1 truncate">
                            Applicant: {activity.userEmail}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {new Date(
                          activity.appliedAt || activity.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable StatCard Component
const StatCard = ({ title, value, color, loading }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    className={`rounded-2xl bg-gradient-to-br ${color} text-white shadow-2xl p-[1px]`}
  >
    <div className="rounded-2xl bg-slate-950/70 p-4 h-full">
      <p className="text-white/70 text-xs uppercase tracking-[0.15em]">
        {title}
      </p>
      <div className="flex items-end justify-between mt-2">
        <h3 className="text-3xl font-bold">
          {loading ? (
            <span className="loading loading-spinner loading-sm text-white"></span>
          ) : (
            value || 0
          )}
        </h3>
        <span className="text-white/40 text-lg">⬤</span>
      </div>
    </div>
  </motion.div>
);

export default Dashboard;
