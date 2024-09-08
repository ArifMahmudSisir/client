import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { isPointWithinRadius } from "geolib";
import { message, Spin } from "antd";
import moment from "moment";
import { useStopwatch } from "react-timer-hook";
import { FaPause, FaPlay } from "react-icons/fa";

const TimeClock = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const axiosSecure = useAxiosSecure();
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [currentAttendance, setCurrentAttendance] = useState({
    data: null,
    error: null,
    loading: false,
  });

  const { user, loading } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [isOnRadius, setIsOnRadius] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation({
            ...location,
            error:
              "Location API is not supported by this browser. Please update your browser",
          });
        }
      );
    } else {
      setLocation({
        ...location,
        error:
          "Location API is not supported by this browser. Please update your browser",
      });
    }
    return null;
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      setCurrentAttendance({ data: null, loading: true, error: null });
      try {
        if (user.attendance) {
          const { data } =
            await axiosSecure.get(`/attendance/users/${user._id}/${user.attendance}
          `);
          setCurrentAttendance({
            data,
            loading: false,
            error: null,
          });

          if (!data?.clockOut) {
            setIsRunning(true);
          }
        } else {
          setCurrentAttendance({
            data: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        messageApi.open({
          type: "error",
          message: "Something went wrong",
        });
        console.error(error);
        setCurrentAttendance({
          data: null,
          loading: false,
          error: error,
        });
      }
    };
    fetchAttendance();
  }, [user]);

  const handleClockIn = async () => {
    try {
      if (!isRunning) {
        const radius = 40000000;
        const [lat, lng] = user.location.coordinates;
        const isOnRadius = isPointWithinRadius(
          {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          {
            latitude: lat,
            longitude: lng,
          },
          radius
        );
        setIsOnRadius(isOnRadius);

        if (isOnRadius) {
          if (location.latitude && location.longitude && user._id) {
            await axiosSecure.post("/attendance/clock-in", {
              userId: user._id,
            });
            setIsRunning(true);
          }
        } else {
          messageApi.open({
            type: "warning",
            content: "You must check in at the exact location first.",
          });
        }
      } else {
        await axiosSecure.post("/attendance/clock-out", {
          userId: user._id,
        });
        setIsRunning(false);
      }
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: "error",
        content: "Something went wrong!",
      });
      console.log(error);
    }
  };

  if (!user && loading) {
    return <Spin size="large" tip="Loading..." />;
  }
  if (currentAttendance.loading) {
    return <Spin size="large" tip="Loading..." />;
  }

  if (!user?.location) {
    return <div>Location not set yet. Please ask your admin to set it up</div>;
  }

  return (
    <div className="md:w-2/6 my-5 mx-auto p-6">
      <Stopwatch
        handleClockIn={handleClockIn}
        attendance={currentAttendance?.data}
        isOnRadius={isOnRadius}
      />
      {contextHolder}
    </div>
  );
};

export default TimeClock;

const Stopwatch = ({ attendance, handleClockIn, isOnRadius }) => {
  const diff = attendance?.clockOut
    ? 0
    : moment().diff(attendance?.clockIn, "seconds");

  const { seconds, minutes, hours, start, reset, isRunning } = useStopwatch({
    autoStart: attendance === null ? false : true,
    offsetTimestamp: new Date().setSeconds(new Date().getSeconds() + diff),
  });

  const onClockIn = async () => {
    if (!isRunning && isOnRadius) {
      start();
    } else {
      reset(new Date(), 0);
    }
    await handleClockIn();
  };

  return (
    <div
      onClick={onClockIn}
      className={`${
        isRunning
          ? "bg-gradient-to-r from-red-600 via-red-500 to-red-600"
          : "bg-gradient-to-r from-green-600 via-green-500 to-green-600"
      } text-white p-6 rounded-lg shadow-lg mb-6 flex items-center justify-between`}
    >
      <div>
        <p className="text-4xl font-bold mb-2">
          {hours > 0 ? `${hours}:` : ""}
          {minutes > 0 ? `${minutes}:` : "00:"}
          {seconds < 10 ? `0${seconds}` : seconds}
        </p>
        <h2>{isRunning ? "Clock Out" : "Clock In"}</h2>
      </div>
      {isRunning ? (
        <FaPause className="text-6xl hover:text-gray-500" />
      ) : (
        <FaPlay className="text-6xl hover:text-gray-500" />
      )}
    </div>
  );
};
