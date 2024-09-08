import React, { useState, useRef, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { LocationMap } from "./LocationMap";
import { Select, Spin } from "antd";

const SetLocation = () => {
  const axiosSecure = useAxiosSecure();
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSetLocation = async () => {
    try {
      // Sends a PUT request to the server to update the user's location
      const response = await axiosSecure.put(
        `/location/set-location/${userId}`,
        selectedPlace.position
      );

      // The server responds with a message indicating success
      setMessage(response.data.msg);
    } catch (error) {
      // Handle any errors that occur during the request
      console.log(error.response.data.message);
      setMessage(error.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div className="m-4">
      <h3 className="text-xl font-semibold mb-4">Set Location</h3>
      <div>
        <div className="flex items-center my-4">
          <UserSelect onChange={(val) => setUserId(val)} />
          <button
            onClick={handleSetLocation}
            className="text-sm md:ms-6 ms-3 md:px-8 px-6 py-2 text-nowrap bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Set Location
          </button>
        </div>
        <p className="my-2 text-center text-gray-600">{message}</p>
        <LocationMap
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
        />
      </div>
    </div>
  );
};

export default SetLocation;

const UserSelect = ({ onChange }) => {
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
