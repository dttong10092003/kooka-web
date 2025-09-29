import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

// =====================
// TYPES
// =====================

interface AuthUser {
  _id: string
  username?: string
  email?: string
  isAdmin?: boolean
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
    const res = await axios.post("http://localhost:3000/api/auth/login", {
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
    const res = await axios.post("http://localhost:3000/api/auth/register", formData)
    return res.data as AuthResponse
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.code || "auth.registerFailed")
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
      localStorage.removeItem("token")
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem("token", action.payload)
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
  },
})

export const { logout, setToken } = authSlice.actions
export default authSlice.reducer
