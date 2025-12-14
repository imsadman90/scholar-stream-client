import { Link, NavLink, useNavigate, useNavigationType } from "react-router-dom";
import scholarship from "/public/scholarship.png";
import avatar from "/avatar.png";
import { useState } from "react";
import { FaHome, FaSchool, FaBars } from "react-icons/fa";
import { FcReadingEbook } from "react-icons/fc";
import { IoHomeOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import useAuth from "../../hooks/useAuth";
import { Contact2 } from "lucide-react";
import NavLinkClass from "./NavLinkClass";

const NavBar = () => {
  const { user, logOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 py-3 bg-white shadow-lg border-b border-gray-100 px-5 h-20">
      <div className="flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/">
          <div className="flex justify-center items-center gap-1">
            <img src={scholarship} alt="Scholarship Logo" className="h-12" />
            <h1 className="text-gray-800 font-bold font-serif italic">
              <span className="text-2xl text-purple-800">S</span>cholarStream
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              NavLinkClass({
                isActive: isActive && navigationType !== "POP",
              })
            }
          >
            <IoHomeOutline className="text-xl" /> Home
          </NavLink>
          <NavLink to="/scholarships" className={NavLinkClass}>
            <FcReadingEbook className="text-xl" /> All Scholarships
          </NavLink>

          <button
            onClick={() => {
              navigate("/", { state: { scrollTo: "contact" } });
              setIsOpen(false);
            }}
            className="
    relative flex items-center gap-2 font-medium
    text-gray-700 hover:text-purple-600 transition-colors

    after:content-['']
    after:absolute
    after:left-0
    after:-bottom-1
    after:h-[2px]
    after:bg-purple-600
    after:w-0
    after:transition-all
    after:duration-300
    hover:after:w-full
  "
          >
            <Contact2 /> Contact
          </button>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center justify-end gap-4 min-w-30">
          {loading ? (
            <div className="h-[50px] w-[50px] shadow-md border-l-2 rounded-full border-orange-500 animate-spin"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 rounded-full hover:shadow-md transition-shadow border border-gray-300"
              >
                <img
                  src={user?.photoURL || avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border overflow-hidden">
                  <div className="px-5 py-4 border-b">
                    <p className="font-semibold text-gray-800">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-purple-50 text-purple-700 font-medium"
                  >
                    <MdDashboard /> Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      logOut();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 font-medium"
                  >
                    <TbLogout /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2.5 text-purple-600 font-semibold hover:text-purple-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-lg hover:bg-gray-100 transition"
          >
            {user ? (
              <img
                src={user?.photoURL || avatar}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <FaBars className="text-2xl text-gray-700" />
            )}
          </button>

          {/* Mobile Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-16 right-4 w-72 bg-white rounded-xl shadow-2xl border overflow-hidden">
              {/* Navigation Links */}
              <div className="border-b">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                >
                  <FaHome className="text-xl text-gray-600" /> Home
                </Link>
                <Link
                  to="/scholarships"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                >
                  <FaSchool className="text-xl text-gray-600" /> All
                  Scholarships
                </Link>
              </div>

              {user ? (
                <>
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <p className="font-bold text-gray-800">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-purple-50 text-purple-700 font-medium"
                  >
                    <MdDashboard /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logOut();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-4 px-6 py-4 hover:bg-red-50 text-red-600 font-medium"
                  >
                    <TbLogout /> Logout
                  </button>
                </>
              ) : (
                <div className="py-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-3.5 text-blue-600 font-medium hover:bg-blue-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-3.5 bg-purple-600 text-white font-medium hover:bg-purple-700 mx-4 rounded-lg text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
