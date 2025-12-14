import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";


const DashboardLayout = () => {
  return (
    <>
      <div className="flex min-h-screen bg-base-100">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
