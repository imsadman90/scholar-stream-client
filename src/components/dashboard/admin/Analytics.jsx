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
import LoadingSpinner from "../../shared/Loading";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../shared/Loading";

const Analytics = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading} = useAuth(); 

  if (loading) {
    return <Loading/>;
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
          0
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
    return <LoadingSpinner />;
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
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-primary">
            Analytics Dashboard
          </h1>
          <FaChartLine className="text-5xl text-primary opacity-80" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<FaUsers />}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Scholarships"
            value={totalScholarships}
            icon={<FaGraduationCap />}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Total Applications"
            value={totalApplications}
            icon={<FaFileAlt />}
            gradient="from-purple-500 to-indigo-600"
          />
          <StatCard
            title="Revenue Collected"
            value={`$${totalFeesCollected.toLocaleString()}`}
            gradient="from-orange-500 to-red-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Bar Chart */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                Top Universities by Applications
              </h2>
              {topUniversities.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  No application data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topUniversities} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="university" angle={-20} textAnchor="end" height={90} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                Scholarship Categories
              </h2>
              {categoryData.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
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
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Quick Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat bg-base-100 rounded-xl">
                <div className="stat-title">Avg. Fee per Application</div>
                <div className="stat-value text-primary">
                  ${totalApplications > 0
                    ? (totalFeesCollected / totalApplications).toFixed(2)
                    : "0.00"}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-xl">
                <div className="stat-title">Scholarships per User</div>
                <div className="stat-value text-secondary">
                  {totalUsers > 0 ? (totalScholarships / totalUsers).toFixed(1) : "0"}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-xl">
                <div className="stat-title">Applications per Scholarship</div>
                <div className="stat-value text-accent">
                  {totalScholarships > 0
                    ? (totalApplications / totalScholarships).toFixed(1)
                    : "0"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className={`card bg-gradient-to-br ${gradient} text-white shadow-2xl`}
  >
    <div className="card-body">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <h3 className="text-4xl font-bold mt-2">{value}</h3>
        </div>
        <div className="text-5xl opacity-70">{icon}</div>
      </div>
    </div>
  </motion.div>
);

export default Analytics;