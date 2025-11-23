import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"

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

interface RegisterResponse {
  message: string
  user: AuthUser
  needVerification?: boolean
  token?: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  loading: boolean
  error: string | null
  isVerified?: boolean
  pendingVerificationEmail?: string
}

// =====================
// INITIAL STATE
// =====================

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: null,
  loading: false,
  error: null,
  isVerified: undefined,
  pendingVerificationEmail: undefined,
}

// =====================
// API CALLS
// =====================

// Login
export const login = createAsyncThunk<
  AuthResponse,
  { usernameOrEmail: string; password: string },
  { rejectValue: string | { code: string; isVerified?: boolean; email?: string } }
>("auth/login", async ({ usernameOrEmail, password }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/auth/login", {
      usernameOrEmail,
      password,
    })
    return res.data as AuthResponse
  } catch (err: any) {
    // Nếu backend trả về isVerified = false, có nghĩa là email chưa verify
    if (err.response?.data?.isVerified === false) {
      const code = err.response?.data?.code || err.response?.data?.message || "auth.emailNotVerified"
      const email = err.response?.data?.email || usernameOrEmail
      return rejectWithValue({ code, isVerified: false, email })
    }
    // Các lỗi khác (sai mật khẩu, user không tồn tại, etc.)
    // Backend trả về message thay vì code, nên lấy message làm error
    const errorMessage = err.response?.data?.code || err.response?.data?.message || "auth.loginFailed"
    return rejectWithValue(errorMessage)
  }
})

// Register
export const registerUser = createAsyncThunk<
  RegisterResponse,
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
    const res = await axiosInstance.post("/auth/register", formData)
    return res.data as RegisterResponse
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
    const res = await axiosInstance.get("/auth/me")
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
    await axiosInstance.get("/auth/verify")
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
    const res = await axiosInstance.post("/auth/forgot-password", { email })
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
    const res = await axiosInstance.post(`/auth/reset-password/${token}`, { 
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
        // Clear token and user when login fails
        state.token = null
        state.user = null
        localStorage.removeItem("token")
        localStorage.removeItem("persist:root")
        
        if (action.payload && typeof action.payload === "object") {
          state.error = action.payload.code || "auth.loginFailed"
          state.isVerified = action.payload.isVerified
          state.pendingVerificationEmail = action.payload.email
        } else {
          state.error = action.payload || "auth.loginFailed"
          state.isVerified = undefined
          state.pendingVerificationEmail = undefined
        }
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        // Chỉ set token và user nếu không cần verify (đăng ký qua Google)
        if (!action.payload.needVerification && action.payload.token) {
          state.user = action.payload.user
          state.token = action.payload.token
          localStorage.setItem("token", action.payload.token)
        }
        // Nếu needVerification = true, không set token, chỉ trả về user info
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
