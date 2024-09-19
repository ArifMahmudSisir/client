import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Spin } from "antd";

const AdminRoute = ({ children }) => {
  const { user, role } = useAuth();
  const token = localStorage.getItem("token");

  if(!user){
    return <Spin size="large" tip="Loading..."/>
  }

  if (token && !role === "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
