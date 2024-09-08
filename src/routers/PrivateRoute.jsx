import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const {user} = useAuth();
  const token = localStorage.getItem("token");

  if (!user) {
    return <div>Loading...</div>; // or handle the case when user is not available
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
