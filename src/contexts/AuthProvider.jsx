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

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const saveUserToDatabase = async (user) => {
    try {
      const userData = {
        email: user.email,
        name: user.displayName || "Anonymous",
        photoURL: user.photoURL || "",
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to save user to database");
      }

      const result = await response.json();
      console.log("User saved to MongoDB:", result);
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  };

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await saveUserToDatabase(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      //  Save to MongoDB after Google sign-in
      await saveUserToDatabase(result.user);
      toast.success("Signed in successfully!");
      return result;
    } catch (error) {
      toast.error("Failed to sign in with Google");
      throw error;
    }
  };

  const logOut = () => {
    setLoading(true);
    toast.success("Log Out Successfully");
    return signOut(auth);
  };

  const updateUserProfile = async (name, photo) => {
    try {
      // ONLY update Firebase, NOT MongoDB
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });

      // Update local state
      setUser({
        ...auth.currentUser,
        displayName: name,
        photoURL: photo,
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Firebase update error:", error);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
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

export default AuthProvider;
