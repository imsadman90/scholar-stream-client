import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/shared/Loading";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const ModeratorRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [role, isRoleLoading] = useRole();

  // DEBUG
  useEffect(() => {
    console.log("ModeratorRoute Check:", {
      user: user?.email,
      authLoading,
      isRoleLoading,
      role,
    });
  }, [user, authLoading, isRoleLoading, role]);

  // Wait for both auth and role to load
  if (authLoading || isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    console.log("ModeratorRoute: No user, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // Check if user is moderator
  if (role !== "moderator") {
    console.log("ModeratorRoute: Not moderator, redirecting. Role:", role);
    return <Navigate to="/" replace />;
  }

  console.log("ModeratorRoute: Access granted");
  return children;
};

export default ModeratorRoute;
