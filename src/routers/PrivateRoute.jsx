import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Spin } from "antd";

const PrivateRoute = ({ children }) => {
  const {user} = useAuth();
  const token = localStorage.getItem("token");

  if (!user) {
    return <Spin size="large" tip="Loading..."/>
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
