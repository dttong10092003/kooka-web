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

// Response interceptor để xử lý lỗi
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            localStorage.removeItem("token");
            localStorage.removeItem("persist:root");
            // Reload trang để clear state và quay về trạng thái guest
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
