import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import SelfReporting from "../pages/UserBoard/SelfReporting";
import TimeClock from "../pages/UserBoard/TimeClock";
import Dashboard from "../layout/Dashboard";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ReportViewing from "../pages/AdminBoard/ReportViewing";
import SetLocation from "../pages/AdminBoard/SetLocation/SetLocation";
import AllUsers from "../pages/AdminBoard/AllUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // Default to Login page
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "work-time",
        element: <TimeClock />,
      },

      {
        path: "self-reporting",
        element: <SelfReporting />,
      },
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "report-viewing",
        element: (
          <AdminRoute>
            <ReportViewing />
          </AdminRoute>
        ),
      },
      {
        path: "set-location",
        element: (
          <AdminRoute>
            <SetLocation />
          </AdminRoute>
        ),
      },
    ],
  },
]);
