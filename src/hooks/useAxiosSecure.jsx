import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        try {
          // ✅ Get Firebase Auth instance directly
          const auth = getAuth();
          const currentUser = auth.currentUser;

          // ✅ Only get token if user exists and is authenticated
          if (currentUser) {
            const token = await currentUser.getIdToken(false); // false = use cached token
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error getting auth token:", error);
        }
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        // ✅ Handle authentication errors
        if (status === 401 || status === 403) {
          console.error("Authentication error, logging out...");
          try {
            await logOut();
          } catch (logoutError) {
            console.error("Logout error:", logoutError);
          }
          navigate("/login", { replace: true });
        }

        return Promise.reject(error);
      }
    );

    // ✅ Cleanup function
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
