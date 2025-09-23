import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

interface Profile {
  userId: string
  firstName: string
  lastName: string
  phone?: string
  location?: string
  bio?: string
  birthDate?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

interface UserState {
  profile: Profile | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
}

// ==================== ASYNC THUNKS ==================== //

// Lấy profile
export const fetchProfile = createAsyncThunk<Profile, string, { rejectValue: string }>(
  "user/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5002/profiles/${userId}`)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile")
    }
  }
)

// Cập nhật profile
export const updateProfile = createAsyncThunk<
  Profile,
  { userId: string; data: Partial<Profile> },
  { rejectValue: string }
>("user/updateProfile", async ({ userId, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`http://localhost:5002/profiles/${userId}`, data)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to update profile")
  }
})

// ==================== SLICE ==================== //
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error fetching profile"
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error updating profile"
      })
  },
})

export const { clearProfile } = userSlice.actions
export default userSlice.reducer
