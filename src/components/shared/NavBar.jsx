import { Link } from "react-router";
import scholarship from "../../../public/scholarship.png";
import avatar from "../../../public/avatar.png";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

const NavBar = () => {
  const authContext = useAuth();
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm px-[2%]">
      <div>
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
          {/* Logo */}
          <Link to="/">
            <img
              className="object-cover"
              src={scholarship}
              alt="logo"
              width="90"
              height="50"
            />
          </Link>

          {/* Center Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex flex-row items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/scholarships"
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              All Scholarship
            </Link>
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <div className="flex flex-row items-center gap-3">
              {/* Dropdown btn */}
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
              >
                <div className="hidden md:block">
                  {/* Avatar */}
                  <img
                    className="rounded-full"
                    referrerPolicy="no-referrer"
                    src={user && user.photoURL ? user.photoURL : avatar}
                    alt="profile"
                    height="30"
                    width="30"
                  />
                </div>
              </div>
            </div>
            {isOpen && (
              <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm">
                <div className="flex flex-col cursor-pointer">
                  <Link
                    to="/"
                    className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                  >
                    Home
                  </Link>
                  <Link
                    to="/scholarships"
                    className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                  >
                    All Scholarship
                  </Link>

                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                      >
                        Dashboard
                      </Link>
                      <div
                        onClick={logOut}
                        className="px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer"
                      >
                        Logout
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
