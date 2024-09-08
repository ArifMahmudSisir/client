import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <NavLink
        to="/admin-dashboard/employs-list"
        className="block py-2.5 px-4 rounded bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white font-semibold mx-3"
      >
        Admin
      </NavLink>
      <NavLink
        to="/user-dashboard"
        className="block py-2.5 px-6 rounded bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white font-semibold"
      >
        User
      </NavLink>
    </div>
  );
};

export default Home;
