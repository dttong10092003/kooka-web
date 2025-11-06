import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

// Lấy API URL từ environment variables, fallback về localhost nếu không có
const API_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:3000/api";

// Tạo axios instance với interceptor
const createAxiosWithAuth = () => {
  const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  })

  // Request interceptor - tự động thêm token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - xử lý lỗi middleware
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token không hợp lệ - clear localStorage
        localStorage.removeItem("token")
        localStorage.removeItem("persist:root")
        
        // Chỉ redirect nếu KHÔNG đang ở trang login hoặc auth-related pages
        const currentPath = window.location.pathname
        const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/google/callback']
        const isAuthPage = authPaths.some(path => currentPath.startsWith(path))
        
        if (!isAuthPage) {
          window.location.href = "/login"
        }
      }
      return Promise.reject(error)
    }
  )

  return axiosInstance
}

const apiClient = createAxiosWithAuth()

// =====================
// TYPES
// =====================

interface AuthUser {
  _id: string
  username?: string
  email?: string
  isAdmin?: boolean
  avatar?: string
}

interface AuthResponse {
  token: string
  user: AuthUser
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  loading: boolean
  error: string | null
}

// =====================
// INITIAL STATE
// =====================

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: null,
  loading: false,
  error: null,
}

// =====================
// API CALLS
// =====================

// Login
export const login = createAsyncThunk<
  AuthResponse,
  { usernameOrEmail: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ usernameOrEmail, password }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      usernameOrEmail,
      password,
    })
    return res.data as AuthResponse
  } catch (err: any) {
    const code = err.response?.data?.code || "auth.loginFailed"
    return rejectWithValue(code)
  }
})

// Register
export const registerUser = createAsyncThunk<
  AuthResponse,
  {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  },
  { rejectValue: string }
>("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, formData)
    return res.data as AuthResponse
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.code || "auth.registerFailed")
  }
})

// Load user từ token (khi app khởi động)
export const loadUser = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>("auth/loadUser", async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get("/auth/me")
    return res.data.user as AuthUser
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to load user")
  }
})

// Verify token
export const verifyToken = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("auth/verifyToken", async (_, { rejectWithValue }) => {
  try {
    await apiClient.get("/auth/verify")
    return true
  } catch (err: any) {
    return rejectWithValue("Token invalid")
  }
})

// Forgot Password - Gửi email reset
export const forgotPassword = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/forgot-password`, { email })
    return res.data as { message: string }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.code || "auth.resetLinkError")
  }
})

// Reset Password - Đặt lại mật khẩu với token từ email
export const resetPassword = createAsyncThunk<
  { message: string },
  { token: string; newPassword: string },
  { rejectValue: string }
>("auth/resetPassword", async ({ token, newPassword }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/reset-password/${token}`, { 
      newPassword 
    })
    return res.data as { message: string }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.code || "auth.resetPasswordError")
  }
})

// =====================
// SLICE
// =====================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
      state.loading = false
      state.error = null
      localStorage.removeItem("token")
      // Xóa toàn bộ persisted state khi logout
      localStorage.removeItem("persist:root")
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem("token", action.payload)
    },
    setAuthData: (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem("token", action.payload.token)
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem("token", action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "auth.loginFailed"
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem("token", action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "auth.registerFailed"
      })

      // LOAD USER
      .addCase(loadUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to load user"
        // Clear token nếu không load được user
        state.token = null
        localStorage.removeItem("token")
      })

      // VERIFY TOKEN
      .addCase(verifyToken.pending, (state) => {
        state.loading = true
      })
      .addCase(verifyToken.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Token invalid"
        state.token = null
        state.user = null
        localStorage.removeItem("token")
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "auth.resetLinkError"
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "auth.resetPasswordError"
      })
  },
})

export const { logout, setToken, setAuthData, clearError } = authSlice.actions
export default authSlice.reducer

// Export apiClient để sử dụng ở các slice khác
export { apiClient }
