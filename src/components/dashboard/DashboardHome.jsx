import Dashboard from "../../pages/Dashboard";
import useRole from "../../hooks/useRole";
import LoadingSpinner from "../shared/Loading";

const DashboardHome = () => {
  const [role, isRoleLoading] = useRole();

  if (isRoleLoading) {
    return <LoadingSpinner />;
  }

  if (role === "admin") {
    return <Dashboard/>;
  }

  if (role === "moderator") {
    return <Dashboard/>; 
  }

  return <Dashboard />;
};

export default DashboardHome;
