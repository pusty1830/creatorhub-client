import React, { useState, useEffect } from "react";
import {
  FaBookmark,
  FaRegBookmark,
  FaShare,
  FaFlag,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  getReddit,
  getTwitterFeed,
  saveFeed,
  getSavedFeeds,
  getSavedFeed,
  addCredit,
} from "../services/services";
import { getUserId } from "../services/axiosClient";
import { toast } from "react-toastify";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [reportedPosts, setReportedPosts] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [userSavedData, setUserSavedData] = useState([]);

  useEffect(() => {
    const fetchUserSavedData = async () => {
      try {
        const userId = getUserId();
        const payLoad = {
          data: { filter: "", userId: userId },
          page: 0,
          pageSize: 50,
          order: [["createdAt", "ASC"]],
        };
        const response = await getSavedFeed(payLoad);
        setUserSavedData(response?.data?.data?.rows);

        // Initialize saved, liked, and reported posts sets
        const savedSet = new Set();
        const likedSet = new Set();
        const reportedSet = new Set();

        response?.data?.data?.rows.forEach((item) => {
          if (item.type === "save") {
            savedSet.add(item.data.id);
          } else if (item.type === "like") {
            likedSet.add(item.data.id);
          } else if (item.type === "Report") {
            reportedSet.add(item.data.id);
          }
        });

        setSavedPosts(savedSet);
        setLikedPosts(likedSet);
        setReportedPosts(reportedSet);
      } catch (error) {
        console.error("Error fetching user saved data:", error);
      }
    };

    fetchUserSavedData();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setPosts([]); // Clear previous posts

        const [redditResponse, twitterResponse] = await Promise.all([
          getReddit().catch((e) => ({ data: { data: [] } })),
          getTwitterFeed().catch((e) => ({ data: { data: [] } })),
        ]);

        const redditPosts = redditResponse?.data?.data?.map((post) => ({
          id: `reddit-${post.id}`,
          author: {
            avatar: "👤",
            name: post.author || "Anonymous",
          },
          content: post.title,
          timestamp: post.createdAt || new Date().toISOString(),
          url: post.url,
          source: "reddit",
          upvotes: post.upvotes || 0,
          image: post.image || null,
        }));

        const twitterPosts = twitterResponse?.data?.data?.map((post) => ({
          id: `twitter-${post.id}`,
          author: {
            avatar: "🐦",
            name: post.author?.name || "Twitter User",
            handle: post.author?.username || "@twitteruser",
          },
          content: post.text,
          timestamp: post.createdAt || new Date().toISOString(),
          url: post.url,
          source: "twitter",
          likes: post.metrics?.like_count || 0,
          comments: post.metrics?.reply_count || 0,
          retweets: post.metrics?.retweet_count || 0,
        }));

        setPosts(
          [...redditPosts, ...twitterPosts].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSave = async (post) => {
    try {
      const payload = {
        userId: getUserId(),
        data: post,
        type: "save",
      };

      const res = await saveFeed(payload);

      // Update saved posts state
      const newSavedPosts = new Set(savedPosts);
      if (newSavedPosts.has(post.id)) {
        newSavedPosts.delete(post.id);
        toast("Feed Removed from Saved");
      } else {
        newSavedPosts.add(post.id);
        if (res?.status === 201) {
          addCredit()
            .then((res) => {
              toast("5 Credits Added with your credits");
            })
            .catch((err) => {
              toast("Credits Added Failed", err);
            });
        }

        // toast("Feed Saved Successfully");
      }
      setSavedPosts(newSavedPosts);
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save feed");
    }
  };

  const handleLike = async (post) => {
    try {
      const payload = {
        userId: getUserId(),
        data: post,
        type: "like",
      };

      const res = await saveFeed(payload);

      // Update liked posts state
      const newLikedPosts = new Set(likedPosts);
      if (newLikedPosts.has(post.id)) {
        newLikedPosts.delete(post.id);
        toast("Feed Unliked");
      } else {
        newLikedPosts.add(post.id);
        if (res?.status === 201) {
          addCredit()
            .then((res) => {
              toast("5 Credits Added with your credits");
            })
            .catch((err) => {
              toast("Credits Added Failed", err);
            });
        }
      }
      setLikedPosts(newLikedPosts);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like feed");
    }
  };

  const handleShare = async (content) => {
    try {
      const res = await navigator.clipboard.writeText(content);
      if (res) {
        addCredit()
          .then((res) => {
            toast("5 Credits Added with your credits");
          })
          .catch((err) => {
            toast("Credits Added Failed", err);
          });
      }
      toast.success("Copied to clipboard!", {
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleReport = async (post) => {
    try {
      const payload = {
        userId: getUserId(),
        data: post,
        type: "Report",
      };

      const res = await saveFeed(payload);

      // Update reported posts state
      const newReportedPosts = new Set(reportedPosts);
      if (newReportedPosts.has(post.id)) {
        newReportedPosts.delete(post.id);
        toast("Report Removed");
      } else {
        newReportedPosts.add(post.id);
        if (res?.status === 201) {
          addCredit()
            .then((res) => {
              toast("5 Credits Added with your credits");
            })
            .catch((err) => {
              toast("Credits Added Failed", err);
            });
        }
      }
      setReportedPosts(newReportedPosts);
    } catch (error) {
      console.error("Error reporting post:", error);
      toast.error("Failed to report feed");
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "saved") return savedPosts.has(post.id);
    if (activeFilter === "liked") return likedPosts.has(post.id);
    if (activeFilter === "reported") return reportedPosts.has(post.id);
    return true;
  });

  // Get saved posts data for the saved filter
  const getSavedPostsData = () => {
    return userSavedData
      .filter((item) => item.type === "save")
      .map((item) => item.data)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const postsToDisplay =
    activeFilter === "saved" ? getSavedPostsData() : filteredPosts;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-4 z-10"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Creator Feed</h1>
              <p className="text-gray-600">
                Your curated content from multiple sources
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === "all"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("saved")}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === "saved"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Saved
              </button>
              <button
                onClick={() => setActiveFilter("liked")}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === "liked"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Liked
              </button>
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="mt-4 h-40 bg-gray-200 rounded-lg"></div>
                <div className="mt-4 flex justify-between">
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {postsToDisplay.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                        {post.author?.avatar || "👤"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {post.author?.name || "Unknown Author"}
                          </p>
                        </div>
                        {post.author?.handle && (
                          <p className="text-xs text-gray-500">
                            {post.author.handle}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {formatDate(post.timestamp)}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-800 mb-4 whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Image (if exists) */}
                    {post.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Engagement Metrics */}
                    <div className="flex items-center text-xs text-gray-500 space-x-4 mb-3">
                      {post.upvotes && <span>▲ {post.upvotes} upvotes</span>}
                      {post.likes && <span>❤️ {post.likes} likes</span>}
                      {post.comments && (
                        <span>💬 {post.comments} comments</span>
                      )}
                      {post.retweets && (
                        <span>🔄 {post.retweets} retweets</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center text-gray-500 border-t border-gray-100 pt-3">
                      <button
                        onClick={() => handleLike(post)}
                        className="group flex items-center gap-1 hover:text-rose-500 transition"
                      >
                        <div className="p-2 rounded-full group-hover:bg-rose-50 transition">
                          {likedPosts.has(post.id) ? (
                            <FaHeart className="text-rose-500" />
                          ) : (
                            <FaRegHeart />
                          )}
                        </div>
                        <span className="text-xs">Like</span>
                      </button>

                      <button
                        onClick={() => handleSave(post)}
                        className="group flex items-center gap-1 hover:text-teal-600 transition"
                      >
                        <div className="p-2 rounded-full group-hover:bg-teal-50 transition">
                          {savedPosts.has(post.id) ? (
                            <FaBookmark className="text-teal-600" />
                          ) : (
                            <FaRegBookmark />
                          )}
                        </div>
                        <span className="text-xs">Save</span>
                      </button>

                      <button
                        onClick={() => handleShare(post.content)}
                        className="group flex items-center gap-1 hover:text-blue-500 transition"
                      >
                        <div className="p-2 rounded-full group-hover:bg-blue-50 transition">
                          <FaShare />
                        </div>
                        <span className="text-xs">Share</span>
                      </button>

                      <button
                        onClick={() => handleReport(post)}
                        className="group flex items-center gap-1 hover:text-rose-600 transition"
                      >
                        <div className="p-2 rounded-full group-hover:bg-rose-50 transition">
                          <FaFlag
                            className={
                              reportedPosts.has(post.id) ? "text-rose-600" : ""
                            }
                          />
                        </div>
                        <span className="text-xs">Report</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {!isLoading && postsToDisplay.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <h3 className="text-lg font-medium text-gray-700">
              No posts found
            </h3>
            <p className="text-gray-500 mt-2">
              {activeFilter === "saved"
                ? "You haven't saved any posts yet"
                : activeFilter === "liked"
                ? "You haven't liked any posts yet"
                : activeFilter === "reported"
                ? "You haven't reported any posts yet"
                : "Try changing your filters or check back later"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feed;
