import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { isPointWithinRadius } from "geolib";
import { message, Spin } from "antd";
import Stopwatch from "./Stopwatch";
import { UploadSelfieModal } from "./UploadSelfie";
import { useStopwatch } from "react-timer-hook";
import moment from "moment";

const TimeClock = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const axiosSecure = useAxiosSecure();
  const [openSelfieModal, setOpenSelfieModal] = useState(false);
  const [selfie, setSelfie] = useState(null);
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
  const [isOnRadius, setIsOnRadius] = useState(false);

  const diff = currentAttendance?.data
    ? 0
    : moment().diff(currentAttendance?.data?.clockIn, "seconds");

  const stopwatch = useStopwatch({
    autoStart: currentAttendance?.data === null ? false : true,
    offsetTimestamp: new Date().setSeconds(new Date().getSeconds() + diff),
  });

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
          const { data } = await axiosSecure.get(
            `/attendance/users/${user._id}/${user.attendance}`
          );
          setCurrentAttendance({
            data,
            loading: false,
            error: null,
          });

          if (!data?.clockOut) {
            const diff = data.clockOut
              ? 0
              : moment().diff(data.clockIn, "seconds");
            stopwatch.reset(
              new Date().setSeconds(new Date().getSeconds() + diff),
              0
            );
            stopwatch.start();
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

  const clockIn = async (selfie) => {
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

    if (isOnRadius) {
      if (location.latitude && location.longitude && user._id) {
        const res = await axiosSecure.post("/attendance/clock-in", {
          selfie,
        });
        if (res.data.attendance._id) {
          const { data } = await axiosSecure.get(
            `/attendance/users/${user._id}/${res.data.attendance._id}`
          );
          setCurrentAttendance({
            data,
            loading: false,
            error: null,
          });
          stopwatch.start();
        }
      }
    } else {
      messageApi.open({
        type: "warning",
        content: "You must check in at the exact location first.",
      });
    }
  };

  const handleClockIn = async () => {
    try {
      if (!stopwatch.isRunning) {
        if (selfie) {
          clockIn(selfie);
        } else {
          setOpenSelfieModal(true);
        }
      } else {
        await axiosSecure.post("/attendance/clock-out", {
          userId: user._id,
        });

        stopwatch.reset();
        stopwatch.pause();
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
  const handleUpload = async (val) => {
    if (val) {
      setSelfie(val);
      setOpenSelfieModal(false);
      clockIn(val);
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
        onClockIn={handleClockIn}
        stopwatch={stopwatch}
        attendance={currentAttendance?.data}
      />
      {contextHolder}
      <UploadSelfieModal
        open={openSelfieModal}
        onClose={() => setOpenSelfieModal(false)}
        onConfirm={handleUpload}
      />
    </div>
  );
};

export default TimeClock;
