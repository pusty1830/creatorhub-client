import React, { useState, useEffect } from "react";
import { Table, Tag, message, Drawer, Button } from "antd";
import {
  FaUsers,
  FaFlag,
  FaTachometerAlt,
  FaSignOutAlt,
  FaUserSlash,
  FaTrash,
  FaEyeSlash,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { deleteUser, getAllUser, getReportFeed } from "../../services/services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/axiosClient";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    posts: false,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchReportedPosts();
  }, []);

  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const payLoad = {
        data: { filter: "", role: "user" },
        page: 0,
        pageSize: 50,
        order: [["createdAt", "ASC"]],
      };
      getAllUser(payLoad)
        .then((res) => {
          setUsers(res?.data?.data?.rows);
        })
        .catch((err) => {
          toast.error("Error While Fetching Error", err);
        });
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchReportedPosts = async () => {
    setLoading((prev) => ({ ...prev, posts: true }));
    try {
      const payLoad = {
        data: { filter: "", type: "Report" },
        page: 0,
        pageSize: 50,
        order: [["createdAt", "ASC"]],
      };
      getReportFeed(payLoad)
        .then((res) => {
          // console.log(res);
          setReportedPosts(res?.data?.data?.rows);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      message.error("Failed to fetch reported posts");
    } finally {
      setLoading((prev) => ({ ...prev, posts: false }));
    }
  };

  const navigate = useNavigate();

  const userColumns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "id",
      responsive: ["md"], // Only show on medium screens and up
      render: (id) => (
        <span className="truncate max-w-xs inline-block">{id}</span>
      ),
    },
    {
      title: "Username",
      dataIndex: "name",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      responsive: ["lg"], // Only show on large screens and up
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2 md:space-x-4">
          <button
            onClick={() => navigate(`/user/${record._id}`)}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm md:text-base"
          >
            <span className="hidden md:inline">Increase Credit</span>
            <span className="md:hidden">+</span>
          </button>
        </div>
      ),
    },
  ];

  const postColumns = [
    {
      title: "Post ID",
      dataIndex: "_id",
      key: "id",
      responsive: ["md"],
      render: (id) => (
        <span className="truncate max-w-xs inline-block">{id}</span>
      ),
    },
    {
      title: "Content",
      dataIndex: ["data", "content"],
      key: "content",
      render: (content) => (
        <span className="text-gray-700">
          {content
            ? isMobile
              ? `${content.substring(0, 20)}...`
              : `${content.substring(0, 50)}...`
            : "No content"}
        </span>
      ),
    },
    {
      title: "Author",
      dataIndex: ["data", "author", "name"], // Properly access nested author name
      key: "author",
      responsive: ["sm"],
      render: (authorName) => (
        <span className="font-medium">{authorName || "Unknown"}</span>
      ),
    },
    {
      title: "Source",
      dataIndex: ["data", "source"],
      key: "source",
      responsive: ["md"],
      render: (source) => (
        <Tag color={source === "reddit" ? "orange" : "blue"}>
          {source?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const renderSidebar = () => {
    if (isMobile) {
      return (
        <Drawer
          title="Admin Panel"
          placement="left"
          closable={true}
          onClose={() => setMobileSidebarVisible(false)}
          visible={mobileSidebarVisible}
          bodyStyle={{ padding: 0 }}
          width={250}
        >
          <nav className="flex-1 p-2">
            <ul>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center p-3 rounded hover:bg-gray-700"
                >
                  <FaTachometerAlt className="text-lg" />
                  <span className="ml-3">Dashboard</span>
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center p-3 rounded hover:bg-gray-700"
                >
                  <FaUsers className="text-lg" />
                  <span className="ml-3">Users</span>
                </a>
              </li>
            </ul>
          </nav>
        </Drawer>
      );
    }

    return (
      <div
        className={`bg-gray-800 text-white ${
          sidebarCollapsed ? "w-20" : "w-64"
        } transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-center h-16 border-b border-gray-700">
          <h1
            className={`text-xl font-bold ${
              sidebarCollapsed ? "hidden" : "block"
            }`}
          >
            Admin Panel
          </h1>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto text-gray-400 hover:text-white"
          >
            {sidebarCollapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="flex-1 p-2">
          <ul>
            <li className="mb-1">
              <a
                href="#"
                className="flex items-center p-3 rounded hover:bg-gray-700"
              >
                <FaTachometerAlt className="text-lg" />
                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </a>
            </li>
            <li className="mb-1">
              <a
                href="#"
                className="flex items-center p-3 rounded hover:bg-gray-700"
              >
                <FaUsers className="text-lg" />
                {!sidebarCollapsed && <span className="ml-3">Users</span>}
              </a>
            </li>
            <li className="mb-1">
              <a
                href="#"
                className="flex items-center p-3 rounded hover:bg-gray-700"
              >
                <FaFlag className="text-lg" />
                {!sidebarCollapsed && (
                  <span className="ml-3">Reported Content</span>
                )}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-6">
          {isMobile && (
            <button
              onClick={() => setMobileSidebarVisible(true)}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <FaBars className="text-xl" />
            </button>
          )}
          <h2 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>
        </header>

        <main className="p-4 md:p-6">
          <div className="mb-6 md:mb-8">
            <div className="bg-white rounded-lg shadow p-4 md:p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaUsers className="mr-2 text-blue-500" /> User Management
              </h3>
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="_id"
                loading={loading.users}
                pagination={{ pageSize: 5 }}
                className="rounded-lg"
                scroll={{ x: true }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaFlag className="mr-2 text-red-500" /> Reported Feed Posts
            </h3>
            <Table
              columns={postColumns}
              dataSource={reportedPosts}
              rowKey="_id"
              loading={loading.posts}
              pagination={{ pageSize: 5 }}
              className="rounded-lg"
              scroll={{ x: true }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
