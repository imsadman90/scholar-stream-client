import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config.js";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";
import axios from "axios";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("jwtToken");
    toast.success("Log Out Successfully");
    return signOut(auth);
  };

  const updateUserProfile = async (name, photo) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });

      setUser({
        ...auth.currentUser,
        displayName: name,
        photoURL: photo,
      });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
            name: currentUser.displayName || "Unknown User",
            email: currentUser.email,
            photoURL: currentUser.photoURL || "",
            role: "student",
          });

          // Get JWT token from backend (no auth needed for login endpoint)
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            {
              email: currentUser.email,
            }
          );

          // Store backend JWT token
          localStorage.setItem("jwtToken", data.token);
        } catch (error) {
          console.error("Failed to authenticate:", error);
        }
      } else {
        // Remove token when user logs out
        localStorage.removeItem("jwtToken");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    setLoading,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
