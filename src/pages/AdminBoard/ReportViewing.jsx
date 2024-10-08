import { useEffect, useState } from "react";
import { Table, Typography, DatePicker, Select, Spin, Alert } from "antd";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import moment from "moment";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const ReportViewing = () => {
  const [users, setUsers] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [attendances, setAttendances] = useState({
    data: [],
    totalTime: null,
    loading: false,
    error: null,
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosSecure.get(`/auth/users`);
        setUsers(data);
      } catch (error) {
        console.error(error);
        setAttendances((prev) => ({
          ...prev,
          error: "An error occurred while fetching users",
        }));
      }
    };

    fetchUsers();
  }, [axiosSecure]);

  // Fetch attendance data when user or date range changes
  useEffect(() => {
    if (!selectedUser || !dateRange) return;

    const fetchUserAttendances = async () => {
      setAttendances({
        data: [],
        totalTime: null,
        loading: true,
        error: null,
      });

      try {
        const { data } = await axiosSecure.get(
          `/attendance/users/${selectedUser}`,
          {
            params: {
              start_time: dateRange[0].startOf("day").toISOString(),
              end_time: dateRange[1].endOf("day").toISOString(),
            },
          }
        );

        // Sort attendances by clockIn date
        const sortedData = data.attendances.sort(
          (a, b) => new Date(b.clockIn) - new Date(a.clockIn)
        );

        setAttendances({
          data: sortedData,
          totalTime: data.totalTime,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error(error);
        setAttendances({
          data: [],
          totalTime: null,
          loading: false,
          error: "An error occurred while fetching attendance data",
        });
      }
    };

    fetchUserAttendances();
  }, [axiosSecure, selectedUser, dateRange]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => moment(record.clockIn).format("D-MM-YY"),
    },
    {
      title: "Clock In",
      dataIndex: "clockIn",
      key: "clockIn",
      render: (text, record) => moment(record.clockIn).format("h:mm:ss A"),
    },
    {
      title: "Clock Out",
      dataIndex: "clockOut",
      key: "clockOut",
      render: (text, record) =>
        record.clockOut ? moment(record.clockOut).format("h:mm:ss A") : "N/A",
    },
    {
      title: "Total Time",
      dataIndex: "totalTime",
      key: "totalTime",
      render: (text, record) => {
        if (!record.clockOut) return "N/A";
        const duration = moment.duration(
          moment(record.clockOut).diff(moment(record.clockIn))
        );
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        return `${hours}:${minutes}:${seconds}`;
      },
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Report Viewing</h1>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Select
          showSearch
          placeholder="Select a user"
          onChange={setSelectedUser}
          style={{ width: "100%", maxWidth: 300 }}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          options={users.map((user) => ({
            value: user._id,
            label: user.username,
          }))}
        />

        <RangePicker
          value={dateRange}
          onChange={handleDateChange}
          format="DD-MM-YYYY"
          style={{ width: "100%", maxWidth: 300 }}
          allowClear={true}
        />
      </div>

      {attendances.error && (
        <Alert
          message="Error"
          description={attendances.error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      {attendances.loading ? (
        <Spin />
      ) : (
        selectedUser &&
        dateRange && (
          <>
            {attendances.totalTime && (
              <Text strong style={{ display: "block", marginBottom: 20 }}>
                Total Time: {attendances.totalTime.hours} hr{" "}
                {attendances.totalTime.minutes} min{" "}
                {Math.round(attendances.totalTime.seconds)} s
              </Text>
            )}
            <Table
              className="border border-gray-300 shadow-lg mt-4"
              columns={columns}
              dataSource={attendances.data}
              rowKey={(record) => record._id}
              pagination={{ pageSize: 7 }}
              scroll={{ x: "max-content", y: 400 }} // Make the table horizontally scrollable if needed
              sticky
            />
          </>
        )
      )}
    </div>
  );
};

export default ReportViewing;
