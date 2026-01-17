import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import AllScholarships from "../pages/AllScholarships";
import ScholarshipDetails from "../pages/ScholarshipDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import ErrorPage from "../pages/ErrorPage";
import Profile from "../components/dashboard/Common/Profile";
import MyApplications from "../components/dashboard/student/MyApplications";
import MyReviews from "../components/dashboard/student/MyReviews";
import Analytics from "../components/dashboard/admin/Analytics";
import AddScholarship from "../components/dashboard/admin/AddScholarship";
import ManageScholarships from "../components/dashboard/admin/ManageScholarships";
import ManageUsers from "../components/dashboard/admin/ManageUsers";
import ManageApplications from "../components/dashboard/moderator/ManageApplications";
import AllReviews from "../components/dashboard/moderator/AllReviews";
import PrivateRoute from "./PrivateRoute";
import AdminRoutes from "./AdminRoutes";
import ModeratorRoute from "./ModeratorRoute";
import DashboardHome from "../components/dashboard/DashboardHome";
import ApplyForScholarship from "../components/Form/ApplyForScholarship";
import PaymentForScholarship from "../components/Payment/PayForScholarship";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "scholarships", element: <AllScholarships /> },

      {
        path: "scholarship-details/:id",
        element: (
          
            <ScholarshipDetails />
        ),
      },

      {
        path: "/apply/:id",
        element: (
          <PrivateRoute>
            <ApplyForScholarship />
          </PrivateRoute>
        ),
      },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-failed", element: <PaymentFailed /> },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },

      {
        path: "payment-page/:id",
        element: (
          <PrivateRoute>
            <PaymentForScholarship />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },

      {
        path: "add-scholarship",
        element: (
          <PrivateRoute>
            <AdminRoutes>
              <AddScholarship />
            </AdminRoutes>
          </PrivateRoute>
        ),
      },
      {
        path: "manage-scholarships",
        element: (
          <PrivateRoute>
            <AdminRoutes>
              <ManageScholarships />
            </AdminRoutes>
          </PrivateRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <PrivateRoute>
            <AdminRoutes>
              <ManageUsers />
            </AdminRoutes>
          </PrivateRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <PrivateRoute>
            <AdminRoutes>
              <Analytics />
            </AdminRoutes>
          </PrivateRoute>
        ),
      },

      {
        path: "manage-applications",
        element: (
          <PrivateRoute>
            <ModeratorRoute>
              <ManageApplications />
            </ModeratorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "all-reviews",
        element: (
          <PrivateRoute>
            <ModeratorRoute>
              <AllReviews />
            </ModeratorRoute>
          </PrivateRoute>
        ),
      },

      {
        path: "my-applications",
        element: (
          <PrivateRoute>
            <MyApplications />
          </PrivateRoute>
        ),
      },
      {
        path: "my-reviews",
        element: (
          <PrivateRoute>
            <MyReviews />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
