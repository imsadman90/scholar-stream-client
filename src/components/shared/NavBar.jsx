import {
  Link,
  NavLink,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
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
    <div className="fixed top-0 left-0 right-0 z-50 h-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900/85 via-slate-900/75 to-slate-900/85 backdrop-blur-xl border-b border-white/20 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 h-full">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <img
                src={scholarship}
                alt="Scholarship Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="leading-none">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300 font-semibold">
                Scholar
              </p>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Stream
              </h1>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 px-2 py-1 rounded-full bg-white/10 border border-white/20 shadow-inner backdrop-blur">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${NavLinkClass({
                isActive: isActive && navigationType !== "POP",
              })} flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/15 transition`
            }
          >
            <IoHomeOutline className="text-xl" /> <span>Home</span>
          </NavLink>
          <NavLink
            to="/scholarships"
            className={(props) =>
              `${NavLinkClass(props)} flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/15 transition`
            }
          >
            <FcReadingEbook className="text-xl" />
            <span> All Scholarships</span>
          </NavLink>

          <button
            onClick={() => {
              navigate("/", { state: { scrollTo: "contact" } });
              setIsOpen(false);
            }}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white hover:text-cyan-300 transition-colors hover:bg-white/15 after:content-[''] after:absolute after:left-3 after:-bottom-1 after:h-[2px] after:bg-cyan-300 after:w-0 after:transition-all after:duration-300 hover:after:w-[60%]"
          >
            <Contact2 /> Contact
          </button>

          {user && (
            <>
              <NavLink
                to="/dashboard"
                className={(props) =>
                  `${NavLinkClass(props)} flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/15 transition`
                }
              >
                <MdDashboard className="text-xl" /> <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/dashboard/profile"
                className={(props) =>
                  `${NavLinkClass(props)} flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/15 transition`
                }
              >
                <FaHome className="text-xl" /> <span>Profile</span>
              </NavLink>
            </>
          )}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center justify-end gap-3 min-w-30">
          {loading ? (
            <div className="h-[46px] w-[46px] border-2 border-white/30 border-t-white rounded-full animate-spin shadow-md"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 rounded-full border border-white/30 bg-white/10 backdrop-blur hover:shadow-lg transition"
              >
                <img
                  src={user?.photoURL || avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/20 bg-gradient-to-r from-slate-800/60 to-slate-900/60">
                    <p className="font-semibold text-white">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-slate-300">{user.email}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 text-cyan-200 font-semibold"
                  >
                    <MdDashboard /> Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      logOut();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-white/10 text-red-300 font-semibold"
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
                className="px-4 py-2.5 text-sm font-semibold text-white hover:text-cyan-300 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:brightness-110 transition"
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
            className="p-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur hover:shadow-md transition"
          >
            {user ? (
              <img
                src={user?.photoURL || avatar}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <FaBars className="text-2xl text-white" />
            )}
          </button>

          {/* Mobile Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-16 right-4 w-[calc(100vw-2rem)] max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Navigation Links */}
              <div className="border-b border-white/20">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/10 transition font-semibold text-white"
                >
                  <FaHome className="text-xl" /> Home
                </Link>
                <Link
                  to="/scholarships"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/10 transition font-semibold text-white"
                >
                  <FaSchool className="text-xl" /> All Scholarships
                </Link>
              </div>

              {user ? (
                <>
                  <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-slate-800/60 to-slate-900/60">
                    <p className="font-bold text-white">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-slate-300">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/10 text-cyan-200 font-semibold"
                  >
                    <MdDashboard /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logOut();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-4 px-6 py-4 hover:bg-white/10 text-red-300 font-semibold"
                  >
                    <TbLogout /> Logout
                  </button>
                </>
              ) : (
                <div className="py-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-3.5 text-white font-semibold hover:bg-white/10 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg mx-4 rounded-full text-center transition"
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
