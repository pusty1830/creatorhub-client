import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import { LoginSchema } from "../components/schema/Schema";
import { Signin, trackLoginAndAddCredits } from "../services/services";
import { toast } from "react-toastify";
import { setCurrentAccessToken } from "../services/axiosClient";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      console.log("Login form submitted:", values);
      const payLoad = {
        email: values.email,
        password: values.password,
      };

      try {
        // 1. First perform the login
        const loginResponse = await Signin(payLoad);

        if (loginResponse?.status === 200) {
          // 2. Set the access token
          setCurrentAccessToken(loginResponse?.data?.data?.accessToken);

          // 3. Track login and check for credit addition
          const creditResponse = await trackLoginAndAddCredits();

          // Show appropriate message based on credit addition
          if (creditResponse?.data?.creditsAdded) {
            toast("Daily login bonus: 10 credits added!", { type: "success" });
          }

          // Show success message
          toast(loginResponse?.data?.msg || "Login successful!", {
            type: "success",
          });

          // 4. Redirect based on user role
          const userRole = loginResponse?.data?.data?.role;

          if (userRole === "admin") {
            window.location.href = "/admin-dashboard";
          } else {
            window.location.href = "/feed";
          }
        } else {
          toast(loginResponse?.data?.msg || "Login failed. Please try again.", {
            type: "error",
          });
        }
      } catch (error) {
        console.error(error);
        toast(
          error?.response?.data?.msg ||
            "Something went wrong. Please try again.",
          {
            type: "error",
          }
        );
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="h-12 w-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <FaLock size={20} />
          </div>
          <h2 className="text-xl font-semibold">Login to your account</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "focus:ring-teal-300"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring pr-10 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "focus:ring-teal-300"
              }`}
            />
            <div
              className="absolute top-9 right-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
