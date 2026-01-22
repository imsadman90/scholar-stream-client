import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import { IoEye, IoEyeOff } from "react-icons/io5";

import LoadingSpinner from "../components/shared/Loading";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const image_hosting_key = import.meta.env.VITE_IMAGEBB_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
  const {
    createUser,
    updateUserProfile,
    signInWithGoogle,
    loading,
    user,
    setLoading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state || "/";

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to={from} replace />;

  const saveUser = async (userData) => {
    const res = await axiosSecure.post(
      `${import.meta.env.VITE_API_URL}/users`,
      userData,
    );
    return res.data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const photoFile = form.photo.files[0];
    const email = form.email.value;
    const password = form.password.value;

    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (!/[A-Z]/.test(password))
      return toast.error("Password must contain 1 uppercase letter");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return toast.error("Password must contain 1 special character");
    if (!photoFile) return toast.error("Upload a profile photo");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", photoFile);

      const imgRes = await fetch(image_hosting_api, {
        method: "POST",
        body: formData,
      });
      const imgData = await imgRes.json();

      const photoURL = imgData.data.display_url;

      await createUser(email, password);
      await updateUserProfile(name, photoURL);

      const userData = {
        name,
        email,
        photoURL,
        role: "Student",
        createdAt: new Date().toISOString(),
      };

      await saveUser(userData);
      toast.success("Registration Successful");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();

      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: "Student",
        createdAt: new Date().toISOString(),
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData);
      toast.success("Google Login Successful");
      navigate(from, { replace: true });
    } catch {
      toast.error("Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-center pt-20">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/40">
              <span className="text-xl font-bold text-slate-950">SS</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                Join us
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Create account
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-300 mb-6">
            Register to manage your scholarship journey and sync progress across
            devices.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              required
              className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30"
            />

            <input
              type="file"
              name="photo"
              accept="image/*"
              required
              className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white file:bg-gradient-to-r file:from-cyan-500 file:to-emerald-500 file:text-slate-950 file:border-0 file:px-4 file:py-2 file:rounded-md focus:outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 py-3 rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin mx-auto" />
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-white/10" />
            <p className="px-3 text-sm text-slate-400">or</p>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 border border-white/15 rounded-lg p-3 cursor-pointer bg-white/5 hover:bg-white/10 text-white transition"
          >
            <FcGoogle size={26} />
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-sm text-slate-300 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              state={from}
              className="text-cyan-200 font-semibold hover:text-white"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Accent Panel */}
        <div className="hidden md:flex flex-col justify-center gap-6 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-emerald-500/20 backdrop-blur-xl shadow-2xl">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-white shadow-lg max-w-xs">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-100 mb-1">
              Why join
            </p>
            <h3 className="text-xl font-semibold mb-2">Unlock more</h3>
            <p className="text-sm text-slate-100/90">
              Save scholarships, track applications, and receive tailored
              updates in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-lg">
            {["Personalized", "Secure", "Synced", "24/7 Support"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-xl bg-white/10 border border-white/10 px-3 py-4 text-center text-sm text-white shadow-md"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
