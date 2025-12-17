import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/shared/Loading";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const ModeratorRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [role, isRoleLoading] = useRole();

  if (authLoading || isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role !== "moderator") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ModeratorRoute;
