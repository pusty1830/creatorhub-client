import { createAxiosClient } from "./axiosConfig";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8080/api/";

export function getCurrentAccessToken() {
  return localStorage.getItem("accessToken");
}

export function isLoggedIn() {
  if (localStorage.getItem("accessToken")) {
    return true;
  } else {
    return false;
  }
}

export async function logout() {
  localStorage.clear();
  window.location.href = "/";
  return 0;
}

export function setCurrentAccessToken(accessToken) {
  return localStorage.setItem("accessToken", accessToken);
}

export function getUserName() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode(token);
    console.log("user Details bro!=", decoded);
    return decoded.name || "";
  } else {
    return "";
  }
}

export function getUserId() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode(token);
    return decoded.id;
  } else {
    return 0;
  }
}

export function getUserType() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode(token);
    return decoded.userType || "";
  } else {
    return "";
  }
}

export function getUserRoll() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode(token);
    return decoded.role || "";
  } else {
    return "";
  }
}

export function getUserEmail() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = jwtDecode(token);
    return decoded.email_id || "";
  } else {
    return 0;
  }
}

export function getUserDetails() {
  let token = localStorage.getItem("accessToken");
  if (token) {
    try {
      let res = jwtDecode(token);
      console.log(res);
      return {
        profileImage: res.profileImage,
        email: res.email_id,
        coverImage: res.coverImage,
        firstName: res.name,
        lastName: res.lastName,
        createdAt: res.createdAt,
        followers: res.followers,
        following: res.following,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  } else {
    return null;
  }
}

export const client = createAxiosClient({
  options: {
    baseURL: BASE_URL,
    timeout: 300000,
    headers: {},
  },
  getCurrentAccessToken,
});
