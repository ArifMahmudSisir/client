import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Logo from "../../assets/logo.jpeg";

const AdminUserRegister = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      await registerUser(formData);
      // Navigate based on user role
      if (formData.role === "admin") {
        navigate("/dashboard/report-viewing");
      } else {
        navigate("/dashboard/work-time");
      }
    } catch (error) {
      // Handle login errors, e.g., show an error message to the user
      console.error("Submission error:", error.message);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 mx-4">
        <img src={Logo} className="h-24 w-24 mb-4" alt="" />
        <div className="bg-white p-8 border-t-4 border-green-400 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-5 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Username
              </label>
              <input
                {...register("username", { required: true })}
                type="text"
                name="username"
                className="w-full px-3 py-2 border-b-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your Username"
              />
              {errors.username && (
                <span className="text-red-500 ms-2">Username is required</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Role</label>
              <input
                {...register("role", { required: true })}
                type="text"
                name="role"
                className="w-full px-3 py-2 border-b-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your role"
              />
              {errors.role && (
                <span className="text-red-500 ms-2">role is required</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email Address
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                name="email"
                className="w-full px-3 py-2 border-b-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="text-red-500 ms-2">Email is required</span>
              )}
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 font-bold mb-2">
                Password
              </label>
              <input
                {...register("password", {
                  required: true,
                  minLength: 6,
                  maxLength: 20,
                  // pattern: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
                })}
                type="password"
                name="password"
                className="w-full px-3 py-2 border-b-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter your password"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500 ms-2">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500 ms-2">Password is 6 characters</p>
              )}
              {errors.password?.type === "maxLength" && (
                <p className="text-red-500 ms-2">
                  Password is less then 20 characters
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold py-2 px-5 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none"
              >
                Registration
              </button>
              <Link
                to="/login"
                className="inline-block align-baseline font-bold text-sm text-green-500"
              >
                Login !
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUserRegister;