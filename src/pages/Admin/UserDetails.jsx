import React, { useEffect, useState } from "react";
import {
  Descriptions,
  Button,
  Form,
  Input,
  Card,
  Tag,
  Divider,
  Space,
  Grid,
} from "antd";
import {
  FaArrowLeft,
  FaCreditCard,
  FaUserAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import { getUserById, updateUser } from "../../services/services";
import { useParams } from "react-router-dom";

const { useBreakpoint } = Grid;

const UserDetailPage = () => {
  // Static user data - replace with your actual data structure
  const [user, setUser] = useState({
    _id: "1234567890",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    credits: 100,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-06-20T14:45:00Z",
  });

  const { id } = useParams();
  useEffect(() => {
    getUserById(id).then((res) => {
      //   console.log(res);
      setUser(res?.data?.data);
    });
  }, []);

  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  // Initialize form with user data
  form.setFieldsValue({
    credits: user.credits,
  });

  const handleUpdateCredits = (values) => {
    updateUser(id, values).then((res) => {
      console.log(res);
    });
    setUpdating(true);
    setTimeout(() => {
      setUser((prev) => ({ ...prev, credits: values.credits }));
      setUpdating(false);
      console.log("Credits would be updated to:", values.credits);
    }, 1000);
  };

  // Responsive layout configurations
  const descriptionColumn = screens.xs ? 1 : screens.md ? 2 : 1;
  const formLayout = screens.xs ? "vertical" : "vertical";
  const cardPadding = screens.xs ? "16px" : "24px";
  const buttonSize = screens.xs ? "middle" : "default";

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      <Button
        type="text"
        icon={<FaArrowLeft />}
        onClick={() => window.history.back()}
        className="mb-2 sm:mb-4"
        size={buttonSize}
      >
        {screens.xs ? "Back" : "Back to Users"}
      </Button>

      <Card
        title={
          <div className="flex items-center">
            <FaUserAlt className="mr-2" />
            <span>User Details</span>
          </div>
        }
        className="shadow-lg"
        bodyStyle={{ padding: cardPadding }}
      >
        <Descriptions
          bordered
          column={descriptionColumn}
          size={screens.xs ? "small" : "default"}
        >
          <Descriptions.Item label="User ID" span={descriptionColumn}>
            <span className="break-all">{user._id}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Username">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">
            <div className="flex items-center">
              <FaEnvelope className="mr-2 min-w-[16px]" />
              <span className="break-all">{user.email}</span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={user.role === "admin" ? "red" : "blue"}>
              {user.role.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Registration Date">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 min-w-[16px]" />
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </Descriptions.Item>
        </Descriptions>

        <Divider
          orientation={screens.xs ? "center" : "left"}
          className="mt-4 sm:mt-6"
        >
          <div className="flex items-center justify-center sm:justify-start">
            <FaCreditCard className="mr-2" />
            <span>Credit Management</span>
          </div>
        </Divider>

        <Form
          form={form}
          onFinish={handleUpdateCredits}
          layout={formLayout}
          className="w-full max-w-md mx-auto"
          initialValues={{ credits: user.credits }}
        >
          <Form.Item
            label="Current Credits"
            name="credits"
            rules={[
              { required: true, message: "Please input credit amount" },
              { pattern: /^[0-9]+$/, message: "Please enter a valid number" },
            ]}
          >
            <Input
              type="number"
              prefix={<FaCreditCard className="text-gray-400" />}
              size={screens.xs ? "middle" : "large"}
            />
          </Form.Item>

          <Form.Item>
            <Space
              direction={screens.xs ? "vertical" : "horizontal"}
              className="w-full"
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={updating}
                icon={<FaCheck />}
                size={buttonSize}
                block={screens.xs}
              >
                Update Credits
              </Button>
              <Button
                onClick={() => form.resetFields()}
                icon={<FaEdit />}
                size={buttonSize}
                block={screens.xs}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <div className="mt-4 sm:mt-6">
        <Card
          title="Additional Information"
          className="shadow-lg"
          bodyStyle={{ padding: cardPadding }}
        >
          <p className="text-gray-600 text-sm sm:text-base">
            Last updated: {new Date(user.updatedAt).toLocaleString()}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailPage;
