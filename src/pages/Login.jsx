import { Link, Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/shared/Loading";
import useAuth from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";

const Login = () => {
  const { signIn, signInWithGoogle, loading, user, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state || "/";

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
      toast.success("Login Successful");
    } catch (err) {
      setLoading(false);
      toast.error("Invalid email or password");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
      toast.success("Login Successful");
    } catch (err) {
      setLoading(false);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-center pt-20">
        {/* Form Section */}
        <div className="glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/40">
              <span className="text-xl font-bold text-slate-950">SS</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                Welcome back
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Sign in
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-300 mb-6">
            Access your dashboard, track applications, and continue where you
            left off.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm text-slate-300">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm text-slate-300">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="********"
                className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-300 hover:text-white"
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 py-3 rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin mx-auto" />
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="mt-3 text-left">
            <button className="text-xs text-slate-400 hover:text-cyan-200">
              Forgot password?
            </button>
          </div>

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
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              state={from}
              className="text-cyan-200 hover:text-white hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Accent Panel */}
        <div className="hidden md:flex flex-col justify-center gap-6 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-emerald-500/20 backdrop-blur-xl shadow-2xl">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-white shadow-lg max-w-xs">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-100 mb-1">
              Why sign in
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Pick up where you left
            </h3>
            <p className="text-sm text-slate-100/90">
              Track applications, manage payments, and keep your scholarship
              shortlist synced across devices.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-lg">
            {["Secure", "Fast", "Synced", "Support"].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-white/10 border border-white/10 px-3 py-4 text-center text-sm text-white shadow-md"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
