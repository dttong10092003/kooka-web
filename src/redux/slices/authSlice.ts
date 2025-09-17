import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Gọi API login
export const login = createAsyncThunk(
  "auth/login",
  async (
    { usernameOrEmail, password }: { usernameOrEmail: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post("http://localhost:5001/auth/login", {
        usernameOrEmail,
        password,
      });
      return res.data; // { message, token, user }
    } catch (err: any) {
      // lấy code từ backend hoặc map thành key i18n
      const code =
        err.response?.data?.code || "auth.loginFailed";

      return rejectWithValue(code);
    }
  }
);


interface AuthState {
  token: string | null;
  user: { username: string; email?: string; isAdmin?: boolean } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user; // lấy user từ backend
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
