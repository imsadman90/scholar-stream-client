import { Link, Navigate, useLocation, useNavigate } from "react-router";
import LoadingSpinner from "../components/shared/Loading";
import useAuth from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import ScholarshipImage from "/close-up-hands-holding-diplomas-caps.jpg";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const { signIn, signInWithGoogle, loading, user, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to={from} replace={true} />;

  const saveOrUpdateUser = async (userData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        name: userData.name || "Unknown User",
        email: userData.email,
        photoURL: userData.image || userData.photoURL || "",
        role: "student",
      });
    } catch (error) {
      console.error(
        "Failed to save user (Login):",
        error.response?.data || error.message
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      setLoading(true);
      const result = await signIn(email, password);

      await saveOrUpdateUser({
        name: result.user?.displayName,
        email: result.user?.email,
        image: result.user?.photoURL,
      });

      toast.success("Login Successful");
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Login failed");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();

      await saveOrUpdateUser({
        name: result.user?.displayName,
        email: result.user?.email,
        image: result.user?.photoURL,
      });

      toast.success("Google Login Successful!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Google Login Failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 md:px-[5%] min-h-screen bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 mt-16 md:mt-[10%] mb-10">
        {/* Form Section */}
        <div className="w-full md:w-[55%] p-6 sm:p-8 rounded-md bg-gray-100 text-gray-900">
          <div className="text-center">
            <h1 className="my-3 text-3xl sm:text-4xl font-bold">Log In</h1>
            <p className="text-sm text-gray-400">
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Enter Your Email Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CBAD8D]"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  placeholder="*******"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CBAD8D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#CBAD8D] w-full rounded-md py-3 text-white hover:bg-[#b89a7a] disabled:opacity-60 flex justify-center items-center"
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin text-xl" />
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="flex items-center pt-4 space-x-1">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="px-3 text-sm text-gray-400">
              Login with social accounts
            </p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div
            onClick={handleGoogleSignIn}
            className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition"
          >
            <FcGoogle size={32} />
            <p>Continue with Google</p>
          </div>

          <p className="px-6 text-sm text-center text-gray-400 mt-4">
            Don't have an account yet?{" "}
            <Link
              state={from}
              to="/register"
              className="hover:underline text-[#CBAD8D] font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-[45%] mt-6 md:mt-0">
          <img
            className="w-full h-64 sm:h-96 md:h-[560px] object-cover rounded-lg shadow-lg"
            src={ScholarshipImage}
            alt="Scholarship"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
