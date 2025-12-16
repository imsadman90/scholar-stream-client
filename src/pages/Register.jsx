import { Link, Navigate, useLocation, useNavigate } from "react-router";
import LoadingSpinner from "../components/shared/Loading";
import useAuth from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import ScholarshipImage from "../../public/close-up-hands-holding-diplomas-caps.jpg";
import axios from "axios";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";

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

  const from = location.state || "/";

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to={from} replace={true} />;

  // Save user to MongoDB
  const saveUser = async (userData) => {
    try {
      const response = await axiosSecure.post(
        `${import.meta.env.VITE_API_URL}/users`,
        userData
      );
      return response.data;
    } catch (error) {
      toast.error("Failed to save user data. Please try again.");
      throw error;
    }
  };

  // Form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const photo = form.photo.value;
    const email = form.email.value;
    const password = form.password.value;

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("Password must contain at least one special character");
      return;
    }

    try {
      setLoading(true);

      // 1. Create user in Firebase
      const result = await createUser(email, password);
      console.log("Firebase user created:", result.user);

      // 2. Update user profile with name and photo
      await updateUserProfile(name, photo);
      console.log("Profile updated");

      // 3. Save user to MongoDB
      const userData = {
        name: name,
        email: email,
        photoURL: photo,
        role: "Student",
        createdAt: new Date().toISOString(),
      };

      await saveUser(userData);
      toast.success("Registration Successful");
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      const result = await signInWithGoogle();
      const googleUser = result.user;

      const userData = {
        name: googleUser?.displayName || "Unknown User",
        email: googleUser?.email,
        photoURL: googleUser?.photoURL || "",
        role: "student",
        createdAt: new Date().toISOString(),
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData);

      toast.success("Google Login Successful!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Google sign in error:", err);
      toast.error(err?.message || "Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-[5%] min-h-screen bg-white">
      <div className="flex w-full max-w-6xl gap-6 mt-[10%] mb-[5%]">
        <div className="w-[55%] p-8 rounded-md bg-gray-100 text-gray-900">
          <div className="text-center">
            <h1 className="my-3 text-4xl font-bold">Register Please</h1>
            <p className="text-sm text-gray-400">
              Sign Up to access your account
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-semibold"
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Enter Your Name Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-200 text-gray-900 focus:outline-none focus:border-[#CBAD8D]"
                />
              </div>

              {/* Photo URL */}
              <div>
                <label
                  htmlFor="photo"
                  className="block mb-2 text-sm font-semibold"
                >
                  Photo URL *
                </label>
                <input
                  type="url"
                  name="photo"
                  id="photo"
                  required
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-200 text-gray-900 focus:outline-none focus:border-[#CBAD8D]"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Enter Your Email Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-200 text-gray-900 focus:outline-none focus:border-[#CBAD8D]"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-sm mb-2 font-semibold block"
                >
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  id="password"
                  required
                  placeholder="*******"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-200 text-gray-900 focus:outline-none focus:border-[#CBAD8D]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must contain: 6+ characters, 1 uppercase, 1 special character
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-[#CBAD8D] w-full rounded-md py-3 text-white hover:bg-[#b89a7a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <TbFidgetSpinner className="animate-spin m-auto text-xl" />
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center pt-4 space-x-1">
            <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
            <p className="px-3 text-sm text-gray-400">Or continue with</p>
            <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle size={32} />
            <p>Continue with Google</p>
          </button>

          {/* Login Link */}
          <p className="px-6 text-sm text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              state={from}
              to="/login"
              className="hover:underline hover:text-[#CBAD8D] text-gray-600 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Image Section - 45% width */}
        <div className="w-[45%]">
          <img
            className="w-full h-full object-cover rounded-lg shadow-lg"
            src={ScholarshipImage}
            alt="Scholarship"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
