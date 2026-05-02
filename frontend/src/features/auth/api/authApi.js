import axios from "../../../services/axiosInstance";

// Login user
export const loginUser = (data) => {
  return axios.post("/api/auth/login", data);
};

// Register user
export const registerUser = (data) => {
  return axios.post("/api/auth/register", data);
};

// Refresh access token
export const refreshToken = () => {
  return axios.post("/api/auth/refresh-token");
};

// Logout user
export const logoutUser = () => {
  return axios.get("/api/auth/logoutUser");
};

export const forgotPassword = (data) =>
  axios.post("/api/auth/forgot-password", data);
