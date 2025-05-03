import React, { useState, useEffect } from "react";
import { Card, Avatar, Button, Tabs, Badge, message, List } from "antd";
import {
  StarOutlined,
  FlagOutlined,
  DollarOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { getProfile, getReportFeed, getSavedFeed } from "../services/services";
import { getUserName } from "../services/axiosClient";

const { TabPane } = Tabs;

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("saved");
  const [userData, setUserData] = useState({
    name: "",
    credits: 0,
    savedPosts: [],
    reportedPosts: [],
  });

  useEffect(() => {
    fetchUserData();
    fetchFeeds();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getProfile();
      setUserData((prev) => ({
        ...prev,
        credits: res.data.data.credits || 0,
        name: res.data.data.name || "",
      }));
    } catch (error) {
      message.error("Failed to fetch user data");
    }
  };

  const fetchFeeds = async () => {
    try {
      const [savedRes, reportedRes] = await Promise.all([
        getSavedFeed({
          data: { filter: "", type: "save" },
          page: 0,
          pageSize: 50,
          order: [["createdAt", "ASC"]],
        }),
        getReportFeed({
          data: { filter: "", type: "Report" },
          page: 0,
          pageSize: 50,
          order: [["createdAt", "ASC"]],
        }),
      ]);

      const savedPosts =
        savedRes.data?.data?.rows?.map((item) => item.data) || [];
      console.log(savedPosts);
      const reportedPosts =
        reportedRes.data?.data?.rows?.map((item) => item.data) || [];

      setUserData((prev) => ({
        ...prev,
        savedPosts,
        reportedPosts,
      }));
    } catch (error) {
      message.error("Failed to fetch saved or reported posts");
    }
  };

  const renderPostCard = (post, isReported) => (
    <Card
      key={post.id}
      style={{
        marginBottom: "16px",
        borderRadius: "12px",
        ...(isReported && { borderLeft: "4px solid red" }),
      }}
      bodyStyle={{ padding: "16px" }}
    >
      <div style={{ display: "flex" }}>
        <Avatar icon={<UserOutlined />} src={post.author.avatar || null} />

        <div style={{ marginLeft: "12px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <strong>{post.author.name || "Unknown"}</strong>
            <span style={{ color: "gray", marginLeft: "8px" }}>
              {post.handle || "@user"} · {post.timestamp || ""}
            </span>
          </div>
          <p style={{ margin: "8px 0" }}>{post.content}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "400px",
            }}
          ></div>
        </div>
      </div>
    </Card>
  );

  const { credits, savedPosts, reportedPosts } = userData;

  return (
    <div className="bg-gradient-to-br from-rose-100 to-teal-100">
      <div
        className="user-dashboard "
        style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
      >
        <div
          className="profile-header"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Avatar size={64} icon={<UserOutlined />} />

          <div style={{ marginLeft: "16px" }}>
            <h2>{userData.name}</h2>
            <div style={{ display: "flex", gap: "16px" }}>
              <span>
                <DollarOutlined /> Credits: <strong>{credits}</strong>
              </span>
              <span>
                <StarOutlined /> {savedPosts.length} Saved
              </span>
              <span>
                <FlagOutlined /> {reportedPosts.length} Reported
              </span>
            </div>
          </div>
        </div>

        <Card
          title={
            <span>
              <DollarOutlined /> Your Credits
            </span>
          }
          style={{ marginBottom: "24px" }}
        >
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h1 style={{ fontSize: "48px", margin: "0" }}>{credits}</h1>
            <p style={{ color: "gray" }}>Available credits</p>
          </div>
        </Card>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <BookOutlined /> Saved Posts
                {savedPosts.length > 0 && (
                  <Badge
                    count={savedPosts.length}
                    style={{ marginLeft: "8px" }}
                  />
                )}
              </span>
            }
            key="saved"
          >
            <List
              itemLayout="vertical"
              dataSource={savedPosts}
              renderItem={(post) => renderPostCard(post, false)}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FlagOutlined /> Reported Posts
                {reportedPosts.length > 0 && (
                  <Badge
                    count={reportedPosts.length}
                    style={{ marginLeft: "8px" }}
                  />
                )}
              </span>
            }
            key="reported"
          >
            <List
              itemLayout="vertical"
              dataSource={reportedPosts}
              renderItem={(post) => renderPostCard(post, true)}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
