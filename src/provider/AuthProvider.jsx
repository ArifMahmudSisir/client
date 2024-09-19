import { createContext, useState, useContext, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem("token") || null,
    user: null,
    role: null,
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (authState.token) {
      setLoading(true); // Set loading to true when starting to fetch user info
      axiosSecure
        .get("/auth/me")
        .then((response) => {
          setAuthState((prevState) => ({
            ...prevState,
            user: response.data,
            role: response.data.role,
          }));
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
          logoutUser();
        })
        .finally(() => {
          setLoading(false); // Set loading to false when fetch is complete
        });
    }
  }, [authState.token, axiosSecure]);

  const registerUser = async ({ username, email, password, role }) => {
    setLoading(true); // Set loading to true when starting registration
    setError(null); // Clear previous error
    try {
      const response = await axiosSecure.post("/auth/register", {
        username,
        email,
        password,
        role,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      setAuthState({ token, role });

      // Fetch user info
      const userResponse = await axiosSecure.get("/auth/me");
      setAuthState((prevState) => ({
        ...prevState,
        user: userResponse.data,
        role: userResponse.data.role,
      }));
    } catch (err) {
      console.error("Registration error:", err.response?.data?.msg || err.message);
      setError(err.response?.data?.msg || err.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false when registration is complete
    }
  };

  const loginUser = async ({ email, password }) => {
    setLoading(true); // Set loading to true when starting login
    setError(null); // Clear previous error
    try {
      const response = await axiosSecure.post("/auth/login", {
        email,
        password,
      });
      const { token, role } = response.data;

      // Store token and role in local storage
      localStorage.setItem("token", token);

      // Update auth state with token and user info
      setAuthState({ token, role });

      // Fetch user info
      const userResponse = await axiosSecure.get("/auth/me");
      setAuthState((prevState) => ({
        ...prevState,
        user: userResponse.data,
        role: userResponse.data.role,
      }));

      // Return role to be used for navigation
      return role;
    } catch (err) {
      console.error("Login error:", err.response?.data?.msg || err.message);
      setError(err.response?.data?.msg || err.message); // Set error message
      throw err; 
    } finally {
      setLoading(false); // Set loading to false when login is complete
    }
  };

  const logoutUser = () => {
    setAuthState({ token: null, user: null, role: null });
    localStorage.removeItem("token");
    // navigate('/login'); // Redirect to login page after logout
  };

  const contextValue = {
    ...authState,
    loading, 
    error, 
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
