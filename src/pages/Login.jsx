import { Link, Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/shared/Loading";
import useAuth from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import { IoEye, IoEyeOff } from "react-icons/io5";
import ScholarshipImage from "/scholar-cartoon.webp";
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
      console.log(err);
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
      console.log(err);
      setLoading(false);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-20 my-10">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-gray-100 p-6 md:p-8 rounded-lg">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Log In</h1>
            <p className="text-sm text-gray-400 mt-1">
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <div>
              <label className="block mb-1 text-sm">Email address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-gray-500"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="********"
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-lime-500 text-white py-3 rounded-md"
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin mx-auto" />
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="mt-3 text-left">
            <button className="text-xs text-gray-400 hover:text-lime-500">
              Forgot password?
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <p className="px-3 text-sm text-gray-400">or</p>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-gray-50"
          >
            <FcGoogle size={28} />
            <span>Continue with Google</span>
          </div>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              state={from}
              className="text-gray-600 hover:text-lime-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Image Section */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={ScholarshipImage}
            alt="Scholarship"
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
