import axios from "axios";

const API_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Function to handle token expiration
const handleTokenExpiration = async (error) => {
  if (error.response?.status === 401) {
    console.log("Token expired. Logging out...");
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login
  }
  return Promise.reject(error);
};

// Add interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  handleTokenExpiration
);

export const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:8080/api/register",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:8080/api/login",
      data
    );
    // localStorage.setItem("jwt", response.token);
    return response;
  } catch (error) {
    throw error;
  }
};
