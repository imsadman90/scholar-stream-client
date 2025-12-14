import { Navigate } from "react-router";
import LoadingSpinner from "../components/shared/Loading";
import useRole from "../hooks/useRole";

const AdminRoutes = ({ children }) => {
  const [role, isRoleLoading] = useRole();

  if (isRoleLoading) return <LoadingSpinner />;
  if (role?.toLowerCase() === "admin") return children;

  return <Navigate to="/" replace />;
};

export default AdminRoutes;
