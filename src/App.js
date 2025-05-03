import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Feed from "./pages/Feed";
import { ToastContainer } from "react-toastify";
import ProfilePage from "./pages/Profile";
import PrivateRoute from "./components/PrivateRote";
import AdminDashbord from "./pages/Admin/AdminDashbord";
import UserDetailPage from "./pages/Admin/UserDetails";
import UserDashboard from "./pages/UserDashboard";

const app = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/feed" element={<PrivateRoute component={Feed} />} />
        <Route
          path="/admin-dashboard"
          element={<PrivateRoute component={AdminDashbord} />}
        />
        <Route
          path="/user/:id"
          element={<PrivateRoute component={UserDetailPage} />}
        />
        <Route
          path="/user-dashboard"
          element={<PrivateRoute component={UserDashboard} />}
        />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <ToastContainer />
      <Footer />
    </Router>
  );
};

export default app;
