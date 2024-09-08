import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { role } = useAuth();
  const token = localStorage.getItem("token");

  if (token && !role === "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
