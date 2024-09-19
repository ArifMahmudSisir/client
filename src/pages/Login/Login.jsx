import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Logo from "../../assets/logo.jpeg";

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginError, setLoginError] = useState(null);

  const onSubmit = async (formData) => {
    try {
      setLoginError(null);
      const role = await loginUser(formData);
      if (role === "admin") {
        navigate("/dashboard/report-viewing");
      } else {
        navigate("/dashboard/work-time");
      }
    } catch (error) {
      console.error("Submission error:", error.message);
      setLoginError("Incorrect email or password. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 mx-4">
        <img src={Logo} className="h-24 w-24 mb-4" alt="" />
        <div className="bg-white p-8 border-t-4 border-green-400 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email Address
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 border-b-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="text-red-500 ms-2">Email is required</span>
              )}
            </div>
            <div className="mb-8">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                {...register("password", { required: true })}
                type="password"
                name="password"
                required
                className="w-full px-3 py-2 border-b-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your password"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500 ms-2">Please enter your password</p>
              )}
            </div>
            {loginError && (
              <div className="mb-4">
                <p className="text-red-500 text-center">{loginError}</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="py-2 px-5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none"
              >
                Login
              </button>
              <Link
                to="/signUp"
                className="inline-block align-baseline font-bold text-sm text-green-500"
              >
                Sign Up!
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
