import { client } from "./axiosClient";

export function Register(payLoad) {
  return client.post("/auth/register", payLoad);
}

export function Signin(payLoad) {
  return client.post("/auth/login", payLoad);
}

export function getTwitterFeed() {
  return client.get("/feedtwitter/twitter");
}
export function getReddit() {
  return client.get("/feedreddit/reddit");
}

export function getProfile() {
  return client.get("/auth/profile");
}
export function upadteProfile(payLoad) {
  return client.patch("/auth/edit-profile", payLoad);
}

export function trackLoginAndAddCredits() {
  return client.post("/auth/track-login");
}

export function saveFeed(payLoad) {
  return client.post(`/Feed/create`, payLoad);
}

export function reportFeed(payLoad) {
  return client.post(`/Feed/create`, payLoad);
}

export function getSavedFeed(payLoad) {
  return client.post(`/Feed/search-record`, payLoad);
}
export function getReportFeed(payLoad) {
  return client.post(`/Feed/search-record`, payLoad);
}

export function addCredit() {
  return client.post(`/auth/add-credits`);
}

export function getAllUser(payLoad) {
  return client.post("User/search-record", payLoad);
}
export function getUserById(id) {
  return client.get(`/User/get-one-record/${id}`);
}
export function updateUser(id, payLoad) {
  return client.patch(`/User/update-record/${id}`, payLoad);
}

export function deleteUser(id) {
  return client.delete(`/User/delete-record/${id}`);
}
