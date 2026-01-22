import { motion } from "framer-motion";
import {
  FaUsers,
  FaGraduationCap,
  FaDollarSign,
  FaFileAlt,
  FaChartLine,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../shared/Loading";

const Analytics = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user?.email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-error text-xl">Please log in to view analytics</p>
      </div>
    );
  }

  const {
    data: analytics = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminAnalytics", user.email],
    queryFn: async () => {
      const [usersRes, scholarshipsRes, applicationsRes] = await Promise.all([
        axiosSecure.get("/users"),
        axiosSecure.get("/scholarships"),
        axiosSecure.get(`/application`),
      ]);

      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const scholarships = Array.isArray(scholarshipsRes.data)
        ? scholarshipsRes.data
        : [];
      const applications = Array.isArray(applicationsRes.data)
        ? applicationsRes.data
        : [];

      const totalFeesCollected = applications
        .filter((app) => app.paymentStatus === "paid")
        .reduce(
          (sum, app) =>
            sum + (app.applicationFees || 0) + (app.serviceCharge || 0),
          0,
        );

      // Top 5 Universities by Applications
      const universityMap = applications.reduce((acc, app) => {
        const name = app.universityName || "Unknown";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      const topUniversities = Object.entries(universityMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([university, applications]) => ({
          university:
            university.length > 20
              ? university.substring(0, 17) + "..."
              : university,
          applications,
        }));

      // Scholarship Categories Distribution
      const categoryMap = scholarships.reduce((acc, s) => {
        const cat = s.scholarshipCategory || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        totalUsers: users.length,
        totalScholarships: scholarships.length,
        totalApplications: applications.length,
        totalFeesCollected,
        topUniversities,
        categoryData,
      };
    },
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000,
  });

  const COLORS = [
    "#10b981",
    "#f59e0b",
    "#3b82f6",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-error text-xl mb-4">Failed to load analytics data</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    totalUsers,
    totalScholarships,
    totalApplications,
    totalFeesCollected,
    topUniversities,
    categoryData,
  } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                Admin
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mt-1">
                Analytics Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                Monitor users, scholarships, and revenue at a glance.
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg text-cyan-200 shadow-lg">
              <FaChartLine className="text-2xl" />
              <span className="text-sm">Live overview</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={<FaUsers />}
              gradient="from-cyan-500/80 via-cyan-500 to-emerald-500"
            />
            <StatCard
              title="Total Scholarships"
              value={totalScholarships}
              icon={<FaGraduationCap />}
              gradient="from-emerald-500/80 via-emerald-500 to-teal-400"
            />
            <StatCard
              title="Total Applications"
              value={totalApplications}
              icon={<FaFileAlt />}
              gradient="from-indigo-500/80 via-violet-500 to-cyan-400"
            />
            <StatCard
              title="Revenue Collected"
              value={`$${totalFeesCollected.toLocaleString()}`}
              gradient="from-amber-500/80 via-orange-500 to-rose-500"
            />
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            {/* Bar Chart */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Top Universities by Applications
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-400/15 text-amber-200 border border-amber-400/30">
                  Top 5
                </span>
              </div>
              {topUniversities.length === 0 ? (
                <p className="text-center py-10 text-slate-400">
                  No application data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={topUniversities}
                    margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="university"
                      angle={-20}
                      textAnchor="end"
                      height={90}
                      fontSize={12}
                      tick={{ fill: "#94a3b8" }}
                    />
                    <YAxis tick={{ fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: 12,
                        border: "1px solid #1e293b",
                        color: "#e2e8f0",
                      }}
                    />
                    <Bar
                      dataKey="applications"
                      fill="#22d3ee"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie Chart */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Scholarship Categories
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/15 text-cyan-200 border border-cyan-400/30">
                  Distribution
                </span>
              </div>
              {categoryData.length === 0 ? (
                <p className="text-center py-10 text-slate-400">
                  No scholarships yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={110}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: 12,
                        border: "1px solid #1e293b",
                        color: "#e2e8f0",
                      }}
                    />
                    <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">
              Quick Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InsightCard
                label="Avg. Fee per Application"
                value={`$${
                  totalApplications > 0
                    ? (totalFeesCollected / totalApplications).toFixed(2)
                    : "0.00"
                }`}
                tone="from-cyan-500/20 via-cyan-500/10 to-transparent"
              />
              <InsightCard
                label="Scholarships per User"
                value={
                  totalUsers > 0
                    ? (totalScholarships / totalUsers).toFixed(1)
                    : "0"
                }
                tone="from-emerald-500/20 via-emerald-500/10 to-transparent"
              />
              <InsightCard
                label="Applications per Scholarship"
                value={
                  totalScholarships > 0
                    ? (totalApplications / totalScholarships).toFixed(1)
                    : "0"
                }
                tone="from-amber-500/20 via-amber-500/10 to-transparent"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.01 }}
    className={`rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-2xl p-[1px]`}
  >
    <div className="rounded-2xl bg-slate-950/60 p-4 h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/70 text-xs font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  </motion.div>
);

const InsightCard = ({ label, value, tone }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-lg relative overflow-hidden">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${tone} pointer-events-none`}
    />
    <div className="relative">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="text-2xl font-semibold text-white mt-1">{value}</p>
    </div>
  </div>
);

export default Analytics;
