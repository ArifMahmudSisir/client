import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  FaClipboardList,
  FaClock,
  FaFileAlt,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import Logo from "../assets/logo.jpeg";

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-200 shadow-lg hidden lg:block">
        <div className="p-6 flex justify-center items-center flex-col">
          <img src={Logo} className="h-14 w-14 rounded-md mb-2" alt="" />
          <h1 className="text-2xl font-bold text-gray-800 ">
            {isAdmin ? "Admin Dashboard" : "User Dashboard"}
          </h1>
        </div>
        <nav className="mt-4 mx-2">
          <NavLink
            to={isAdmin ? "/dashboard/report-viewing" : "/dashboard/work-time"}
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:text-white hover:font-semibold"
          >
            {isAdmin ? "Report Viewing" : "Work Time"}
          </NavLink>

          <NavLink
            to={isAdmin ? "/dashboard/all-users" : "/dashboard/self-reporting"}
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:text-white hover:font-semibold"
          >
            {isAdmin ? "All Users" : "Self Reporting"}
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/dashboard/set-location"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:text-white hover:font-semibold"
            >
              Set Location
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            className="block w-full py-2.5 px-4 mt-4 rounded transition duration-200 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 text-white font-semibold"
          >
            LogOut
          </button>
        </nav>
      </div>
      {/* Main Content Area */}
      <div className="relative lg:flex-1 flex flex-col overflow-x-hidden overflow-y-auto md:px-20 px-4 mt-10 lg:mx-10 mx-auto">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${Logo})`,
            backgroundSize: "16rem", // Set image size to 200px
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center", // Center the image in the div
            opacity: 0.2, // Control the image's opacity here
            zIndex: 1, // Make sure it stays behind the content
          }}
        />

        {/* Main Content */}
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>

      {/* Mobile Navbar */}
      <nav className="fixed w-full bottom-0 inset-x-0 bg-gray-800 text-white shadow-lg lg:hidden z-50">
        <div className="flex justify-between items-center p-4">
          <Link
            to={isAdmin ? "/dashboard/report-viewing" : "/dashboard/work-time"}
            className="flex flex-col items-center"
          >
            {isAdmin ? (
              <FaFileAlt className="text-lg" />
            ) : (
              <FaClock className="text-lg" />
            )}

            <span className="text-xs">
              {isAdmin ? "Report Viewing" : "Work Time"}
            </span>
          </Link>
          <Link
            to={
              isAdmin ? "/dashboard/set-location" : "/dashboard/self-reporting"
            }
            className="flex flex-col items-center"
          >
            {isAdmin ? (
              <FaMapMarkerAlt className="text-lg" />
            ) : (
              <FaFileAlt className="text-lg" />
            )}

            <span className="text-xs">
              {isAdmin ? "Set Location" : "Self Reporting"}
            </span>
          </Link>
          {isAdmin && (
            <Link
              to={isAdmin && "/dashboard/all-users"}
              className="flex flex-col items-center"
            >
              {isAdmin && <FaClipboardList className="text-lg" />}

              <span className="text-xs">{isAdmin && "All Users"}</span>
            </Link>
          )}
          <Link onClick={handleLogout} className="flex flex-col items-center">
            <FaSignOutAlt className="text-lg" />
            <span className="text-xs">LogOut</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
