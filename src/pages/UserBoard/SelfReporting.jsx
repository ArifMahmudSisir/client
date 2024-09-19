import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { DatePicker, Select, Space, Table, Typography, Row, Col } from "antd";
import moment from "moment";

const { Text } = Typography;
const { Option } = Select;

const SelfReporting = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [attendances, setAttendances] = useState({
    data: [],
    loading: false,
    error: null,
  });
  const [type, setType] = useState("date");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  useEffect(() => {
    const fetchAttendance = async (dateRange) => {
      setAttendances({
        data: [],
        loading: true,
        error: null,
      });
      try {
        const url = dateRange
          ? `/attendance/users/${user._id}?start_time=${dateRange[0]}&end_time=${dateRange[1]}`
          : `/attendance/users/${user._id}?limit=5&sort=-clockIn`;

        const { data } = await axiosSecure.get(url);

        const sortedData = data.attendances.sort(
          (a, b) => new Date(b.clockIn) - new Date(a.clockIn)
        );

        setAttendances({
          data: sortedData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error(error);
        setAttendances({
          data: [],
          loading: false,
          error,
        });
      }
    };

    if (type === "range" && selectedDateRange[0] && selectedDateRange[1]) {
      const [startTime, endTime] = selectedDateRange.map((date) =>
        moment(date).startOf("day").toISOString()
      );
      fetchAttendance([startTime, endTime]);
    } else if (selectedDate) {
      const startTime = moment(selectedDate).startOf(type).toISOString();
      const endTime = moment(selectedDate).endOf(type).toISOString();
      fetchAttendance([startTime, endTime]);
    } else {
      fetchAttendance();
    }
  }, [type, selectedDate, selectedDateRange, user._id, axiosSecure]);

  const PickerWithType = ({ type, onChange }) => {
    if (type === "range") {
      return (
        <DatePicker.RangePicker
          onChange={onChange}
          className="w-full"
          showTime={false}
        />
      );
    }
    if (type === "time") {
      return (
        <DatePicker showTime onChange={onChange} className="w-full" />
      );
    }
    if (type === "date") {
      return (
        <DatePicker onChange={onChange} className="w-full" />
      );
    }
    if (type === "month") {
      return (
        <DatePicker picker="month" onChange={onChange} className="w-full" />
      );
    }
    if (type === "year") {
      return (
        <DatePicker picker="year" onChange={onChange} className="w-full" />
      );
    }
    return null;
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

  const getSelectedDateText = () => {
    if (type === "range" && selectedDateRange[0] && selectedDateRange[1]) {
      return `${moment(selectedDateRange[0]).format("Do MMM YYYY")} - ${moment(
        selectedDateRange[1]
      ).format("Do MMM YYYY")}`;
    }
    if (!selectedDate) return null;
    return type === "year"
      ? moment(selectedDate).format("YYYY")
      : type === "month"
      ? moment(selectedDate).format("MMMM YYYY")
      : moment(selectedDate).format("Do MMM YYYY");
  };

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <h1 className="text-3xl font-bold mb-4">Self Reporting</h1>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Select value={type} onChange={setType} style={{ width: "100%" }}>
              <Option value="date">Date</Option>
              <Option value="range">Date Range</Option>
              <Option value="month">Month</Option>
              <Option value="year">Year</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={16}>
            <PickerWithType
              type={type}
              onChange={type === "range" ? setSelectedDateRange : setSelectedDate}
            />
          </Col>
        </Row>
        {selectedDate ||
        (type === "range" && selectedDateRange[0] && selectedDateRange[1]) ? (
          <Text>{`Selected ${type}: ${getSelectedDateText()}`}</Text>
        ) : null}
      </Space>
      {attendances.data.length > 0 ? (
        <Table
          columns={columns}
          dataSource={attendances.data}
          loading={attendances.loading}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 7 }}
          scroll={{ y: 400 }}
          sticky
        />
      ) : (
        <div className="mt-4 text-center">
          <Text type="secondary">
            {!selectedDate &&
              `Please select a ${type} to view attendance records.`}
          </Text>
        </div>
      )}
    </div>
  );
};

export default SelfReporting;
