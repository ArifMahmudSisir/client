import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Image, Table, Typography } from "antd";
import moment from "moment";
const { Text } = Typography;

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [axiosSecure]);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Admin Set location",
      key: "location",
      render: (text, record) => {
        const location = record.location;

        if (location && location.coordinates) {
          return (
            <Text type="secondary">
              <div className="text-neutral-900">{location.label}</div>
              <div>
                <div className="text-xs">Lat: {location.coordinates[0]}</div>
                <div className="text-xs">Lng: {location.coordinates[1]}</div>
              </div>
            </Text>
          );
        } else {
          return <Text type="secondary">Location not set</Text>; // Show default message if no location
        }
      },
    },
    {
      title: "Current attendance",
      key: "attendance",
      render: (text, record) => {
        const attendance = record.attendance || [];
        if (record.attendance) {
          return (
            <div>
              <div className="text-xs text-neutral-500">Clocked on,</div>
              <div>
                {moment(attendance.clockIn).format("DD/MM/YYYY hh:mm:ss a")}
              </div>
              <div>
                Elapsed:{" "}
                {moment
                  .utc(moment().diff(moment(attendance.clockIn)))
                  .format("HH:mm:ss")}
              </div>
            </div>
          );
        }
        return <Text type="secondary">No attendance data</Text>;
      },
    },
    {
      title: "Selfie",
      key: "attendance",
      render: (text, record) => {
        const attendance = record.attendance || [];
        if (record.attendance) {
          return (
            <div>
              <Image src={attendance.selfie} height={96} width={96} />
            </div>
          );
        }
        return <Text type="secondary">No attendance data</Text>;
      },
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">All Users</h1>
      {error && (
        <Text type="danger" style={{ marginBottom: 20 }}>
          {error}
        </Text>
      )}
      <div className="overflow-x-auto">
        <Table
          className="border border-gray-300 shadow-lg rounded-lg table-bordered-custom"
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default AllUsers;
