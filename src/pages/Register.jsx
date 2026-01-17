import { Link, Navigate, useLocation, useNavigate } from "react-router";
import LoadingSpinner from "../components/shared/Loading";
import useAuth from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import ScholarshipImage from "/scholar-cartoon.webp";
import axios from "axios";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

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
      userData
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
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-20 dark:bg-base-300">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 py-20">
        {/* Form */}
        <div className="w-full md:w-1/2 bg-gray-100 p-6 md:p-8 rounded-lg dark:bg-base-100">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Register</h1>
            <p className="text-sm text-gray-400 mt-1">
              Sign up to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <input
              name="name"
              placeholder="Full Name"
              required
              className="w-full px-3 py-2 rounded-md border bg-gray-200 dark:bg-base-200 dark:border-none"
            />

            <input
              type="file"
              name="photo"
              accept="image/*"
              required
              className="dark:bg-base-200 dark:border-none w-full px-3 py-2 rounded-md border bg-gray-200 file:bg-lime-500 file:text-white file:border-0 file:px-4 file:py-2"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-3 py-2 rounded-md border bg-gray-200 dark:bg-base-200 dark:border-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full px-3 py-2 rounded-md border bg-gray-200 dark:bg-base-200 dark:border-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-500 text-white py-3 rounded-md"
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin mx-auto" />
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <p className="px-3 text-sm text-gray-400">or</p>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 border rounded-md p-2 dark:border-none dark:bg-base-200"
          >
            <FcGoogle size={26} />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              state={from}
              className="text-green-500 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={ScholarshipImage}
            alt="Scholarship"
            className="w-full h-[500px] object-cover rounded-lg dark:opacity-70"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
