import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiClient } from "./authSlice"

// =====================
// TYPES
// =====================

export interface Like {
  _id: string
  commentId: string
  userId: string
  createdAt: string
}

interface LikeState {
  likedComments: Set<string> // Set của commentId mà user đã like
  loading: boolean
  error: string | null
}

// =====================
// INITIAL STATE
// =====================

const initialState: LikeState = {
  likedComments: new Set(),
  loading: false,
  error: null,
}

// =====================
// API CALLS
// =====================

// Lấy tất cả likes của user cho các comments
export const getUserLikes = createAsyncThunk<
  string[],
  string,
  { rejectValue: string }
>("likes/getUserLikes", async (_recipeId, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(`/likes/user`)
    // Trả về array của commentIds mà user đã like
    return res.data.likes?.map((like: Like) => like.commentId) || []
  } catch (err: any) {
    // Nếu lỗi, trả về array rỗng thay vì reject để không block UI
    console.warn('Failed to load user likes:', err.response?.data?.message || err.message)
    return rejectWithValue(err.response?.data?.message || "Failed to load likes")
  }
})

// Like một comment
export const likeComment = createAsyncThunk<
  { commentId: string; likes: number },
  string,
  { rejectValue: string }
>("likes/likeComment", async (commentId, { rejectWithValue }) => {
  try {
    const res = await apiClient.post(`/likes/${commentId}`)
    return {
      commentId,
      likes: res.data.likes || 0,
    }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to like comment")
  }
})

// Unlike một comment
export const unlikeComment = createAsyncThunk<
  { commentId: string; likes: number },
  string,
  { rejectValue: string }
>("likes/unlikeComment", async (commentId, { rejectWithValue }) => {
  try {
    const res = await apiClient.delete(`/likes/${commentId}`)
    return {
      commentId,
      likes: res.data.likes || 0,
    }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to unlike comment")
  }
})

// =====================
// SLICE
// =====================

const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    clearLikes: (state) => {
      state.likedComments.clear()
      state.error = null
    },
    clearLikeError: (state) => {
      state.error = null
    },
    // Toggle like locally (optimistic update)
    toggleLikeLocally: (state, action) => {
      const commentId = action.payload
      if (state.likedComments.has(commentId)) {
        state.likedComments.delete(commentId)
      } else {
        state.likedComments.add(commentId)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // GET USER LIKES
      .addCase(getUserLikes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserLikes.fulfilled, (state, action) => {
        state.loading = false
        state.likedComments = new Set(action.payload)
      })
      .addCase(getUserLikes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to load likes"
      })

      // LIKE COMMENT
      .addCase(likeComment.pending, (state) => {
        state.error = null
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.likedComments.add(action.payload.commentId)
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to like comment"
      })

      // UNLIKE COMMENT
      .addCase(unlikeComment.pending, (state) => {
        state.error = null
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        state.likedComments.delete(action.payload.commentId)
      })
      .addCase(unlikeComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to unlike comment"
      })
  },
})

export const { clearLikes, clearLikeError, toggleLikeLocally } = likeSlice.actions
export default likeSlice.reducer

// Helper để serialize Set trong Redux persist
export const serializeLikeState = (state: LikeState) => ({
  ...state,
  likedComments: Array.from(state.likedComments),
})

export const deserializeLikeState = (state: any): LikeState => ({
  ...state,
  likedComments: new Set(state.likedComments || []),
})
