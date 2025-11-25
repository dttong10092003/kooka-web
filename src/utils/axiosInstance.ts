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
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor để xử lý lỗi
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || "";
        
        if (status === 401) {
            // ✅ FIX: CHỈ redirect khi là lỗi authentication (đã đăng nhập nhưng token hết hạn)
            // KHÔNG redirect khi là login/register failed (chưa có token hợp lệ)
            
            const isAuthEndpoint = 
                requestUrl.includes("/auth/login") || 
                requestUrl.includes("/auth/register") ||
                requestUrl.includes("/auth/forgot-password") ||
                requestUrl.includes("/auth/reset-password");
            
            // Nếu KHÔNG PHẢI auth endpoint → token hết hạn → logout và redirect
            if (!isAuthEndpoint) {
                console.log("🔴 Token expired or invalid, logging out...");
                localStorage.removeItem("token");
                localStorage.removeItem("persist:root");
                window.location.href = "/login";
            } else {
                // Nếu là auth endpoint → để component xử lý error
                console.log("🔴 Auth failed:", requestUrl);
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;