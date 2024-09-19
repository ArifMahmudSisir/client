import { FaPause, FaPlay } from "react-icons/fa";

const Stopwatch = ({ onClockIn, stopwatch }) => {
  const { isRunning, hours, minutes, seconds } = stopwatch;
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

export default Stopwatch;
