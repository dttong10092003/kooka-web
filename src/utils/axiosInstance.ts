import axios from "axios";

// Lấy API URL từ environment variables, fallback về localhost nếu không có
const API_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm token tự động vào mỗi request nếu có
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // token lưu khi đăng nhập
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
