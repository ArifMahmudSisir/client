import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Table, Typography } from "antd";

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
          scroll={{ x: 'max-content' }} // Optional: Enable horizontal scrolling if needed
        />
      </div>
    </div>
  );
};

export default AllUsers;
