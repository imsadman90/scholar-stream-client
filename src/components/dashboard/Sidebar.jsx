import { motion } from "framer-motion";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaPlus,
  FaList,
  FaUsers,
  FaChartBar,
  FaTasks,
  FaStar,
  FaFileAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { TbLogout2 } from "react-icons/tb";

const Sidebar = () => {
  const { user, logOut } = useAuth();
  const [role, isRoleLoading] = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      await logOut();
      setIsOpen(false);
    } catch (error) {}
  };

  const userRole = role?.toLowerCase();

  const adminLinks = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/dashboard/profile", icon: FaUser, label: "My Profile" },
    {
      path: "/dashboard/add-scholarship",
      icon: FaPlus,
      label: "Add Scholarship",
    },
    {
      path: "/dashboard/manage-scholarships",
      icon: FaList,
      label: "Manage Scholarships",
    },
    { path: "/dashboard/manage-users", icon: FaUsers, label: "Manage Users" },
    { path: "/dashboard/analytics", icon: FaChartBar, label: "Analytics" },
  ];

  const moderatorLinks = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/dashboard/profile", icon: FaUser, label: "My Profile" },
    {
      path: "/dashboard/manage-applications",
      icon: FaTasks,
      label: "Manage Applications",
    },
    { path: "/dashboard/all-reviews", icon: FaStar, label: "All Reviews" },
  ];

  const studentLinks = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/dashboard/profile", icon: FaUser, label: "My Profile" },
    {
      path: "/dashboard/my-applications",
      icon: FaFileAlt,
      label: "My Applications",
    },
    { path: "/dashboard/my-reviews", icon: FaStar, label: "My Reviews" },
  ];

  const getLinks = () => {
    if (userRole === "admin") return adminLinks;
    if (userRole === "moderator") return moderatorLinks;
    return studentLinks; // default: student
  };

  const links = getLinks();
  const roleDisplay =
    userRole === "admin"
      ? "Admin"
      : userRole === "moderator"
        ? "Moderator"
        : "Student";

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 right-4 z-50 h-12 w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-xl flex items-center justify-center text-white hover:bg-white/15 transition"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{
          x:
            isOpen ||
            (typeof window !== "undefined" && window.innerWidth >= 1024)
              ? 0
              : -300,
        }}
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 z-40 flex flex-col
          bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950/80 text-slate-100
          border-r border-white/10 shadow-2xl backdrop-blur-xl
          ${isOpen ? "block" : "hidden lg:flex"}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden shadow-lg">
                <img
                  src={user?.photoURL || "https://i.pravatar.cc/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                Dashboard
              </p>
              <h3 className="font-semibold text-white leading-tight">
                {user?.displayName || "User"}
              </h3>
              <span className="inline-flex items-center gap-2 px-2 py-1 mt-1 text-xs rounded-full bg-white/10 border border-white/20 text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                {roleDisplay}
              </span>
            </div>
          </div>
          {user?.email && (
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <motion.li
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <NavLink
                  to={link.path}
                  end={link.path === "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 backdrop-blur-sm ${
                      isActive
                        ? "bg-cyan-500/20 border-cyan-400/40 text-white shadow-lg shadow-cyan-500/20"
                        : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 text-slate-200"
                    }`
                  }
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition ${
                      window?.location?.pathname === link.path
                        ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200"
                        : "bg-white/5 border-white/10 text-cyan-100 group-hover:border-cyan-300/40"
                    }`}
                  >
                    <link.icon />
                  </span>
                  <div className="flex-1">
                    <span className="font-medium">{link.label}</span>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mt-2 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Back to Home */}
        <div className="p-4 grid space-y-3 border-t border-white/10 bg-white/5">
          <a
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10 transition"
          >
            <FaHome />
            Back to Home
          </a>
          <button
            onClick={handleLogOut}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
          >
            <TbLogout2 size={20} />
            Log Out
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
