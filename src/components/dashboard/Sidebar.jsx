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
    } catch (error) {
    }
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
        className="lg:hidden fixed top-5 right-4 z-50 btn btn-primary btn-circle"
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
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -300 }}
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 bg-base-200 
          shadow-xl z-40 flex flex-col
          ${isOpen ? "block" : "hidden lg:flex"}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-base-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user?.photoURL || "https://i.pravatar.cc/150"}
                  alt="Profile"
                />
              </div>
            </div>
            <div>
              <h3 className="font-bold">{user?.displayName || "User"}</h3>
              <span className="badge badge-primary badge-sm">
                {roleDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <motion.li
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={link.path}
                  end={link.path === "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-lg"
                        : "hover:bg-base-300"
                    }`
                  }
                >
                  <link.icon className="text-xl" />
                  <span className="font-medium">{link.label}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Back to Home */}
        <div className="p-4 grid space-y-3 border-t border-base-300">
          <a href="/" className="btn btn-outline w-full">
            <FaHome />
            Back to Home
          </a>
          <button onClick={handleLogOut} className="btn btn-primary w-full">
            {" "}
            <TbLogout2 size={20} />
            LogOut
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
