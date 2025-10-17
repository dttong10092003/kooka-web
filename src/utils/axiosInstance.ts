import axios from "axios";

const API_URL = "http://localhost:3000/api";

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
