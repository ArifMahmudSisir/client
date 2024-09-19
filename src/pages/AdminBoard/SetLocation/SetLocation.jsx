import React, { useState, useRef, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { LocationMap } from "./LocationMap";
import { Select, Spin, Checkbox } from "antd";

const SetLocation = () => {
  const axiosSecure = useAxiosSecure();
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [applyToAll, setApplyToAll] = useState(false); // State for applying location to all users

  console.log(selectedPlace);

  const handleSetLocation = async () => {
    try {
      if (applyToAll) {
        // Send request to set the same location for all users
        const response = await axiosSecure.put(`/location/set-location-all`, selectedPlace);
        setMessage(response.data.msg);
      } else {
        // Sends a PUT request to the server to update the specific user's location
        const response = await axiosSecure.put(
          `/location/set-location/${userId}`,
          selectedPlace
        );
        setMessage(response.data.msg);
      }
    } catch (error) {
      console.log(error.response.data.message);
      setMessage(error.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div className="m-4">
  <h3 className="text-xl font-semibold mb-4">Set Location</h3>
  <div>
    <div className="flex flex-wrap items-center my-4">
      <UserSelect
        onChange={(val) => setUserId(val)}
        disabled={applyToAll}
        className="w-full md:w-auto"
      />
      <Checkbox
        checked={applyToAll}
        onChange={(e) => setApplyToAll(e.target.checked)}
        className="ml-0 mt-2 md:ml-4 md:mt-0 w-full md:w-auto"
      >
        Set same location for all users
      </Checkbox>
      <button
        onClick={handleSetLocation}
        className="text-sm w-full md:w-auto mt-3 md:mt-0 md:ms-6 ms-3 md:px-8 px-6 py-2 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Set Location
      </button>
    </div>
    <p className="my-2 text-center text-gray-600">{message}</p>
    <div className="w-full h-64 md:h-96">
      <LocationMap
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
      />
    </div>
  </div>
</div>
  );
};

export default SetLocation;

const UserSelect = ({ onChange, disabled }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosSecure.get(`/auth/users`);
        setUsers(data);
      } catch (error) {
        console.log(error);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Spin />;
  if (error) return <p>{error}</p>;

  return (
    <Select
      showSearch
      placeholder="Select a user"
      onChange={onChange}
      style={{ width: 400 }}
      disabled={disabled} // Disable user select when applying to all
      filterOption={(input, option) => {
        return (
          option.label.toLowerCase().includes(input.toLowerCase()) ||
          option.value.toLowerCase().includes(input.toLowerCase())
        );
      }}
      options={users.map((user) => ({
        value: user._id,
        label: user.username,
      }))}
    />
  );
};
