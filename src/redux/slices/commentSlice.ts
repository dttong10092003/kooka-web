import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { apiClient } from "./authSlice"

// =====================
// TYPES
// =====================

export interface Comment {
  _id: string
  recipeId: string
  userId: string
  userName: string
  firstName: string
  lastName: string
  userAvatar: string | null
  content: string
  likes: number
  parentCommentId?: string | null
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

interface CommentState {
  comments: Comment[]
  loading: boolean
  error: string | null
  totalComments: number
}

// =====================
// INITIAL STATE
// =====================

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
  totalComments: 0,
}

// =====================
// API CALLS
// =====================

// Lấy tất cả comments của recipe
export const getCommentsByRecipeId = createAsyncThunk<
  { comments: Comment[]; total: number },
  string,
  { rejectValue: string }
>("comments/getByRecipeId", async (recipeId, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(`/comments/recipe/${recipeId}`)
    return {
      comments: res.data.comments || res.data,
      total: res.data.total || res.data.length || 0,
    }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to load comments")
  }
})

// Tạo comment mới
export const createComment = createAsyncThunk<
  Comment,
  { recipeId: string; content: string },
  { rejectValue: string }
>("comments/create", async ({ recipeId, content }, { rejectWithValue }) => {
  try {
    const res = await apiClient.post("/comments", { recipeId, content })
    return res.data.comment || res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to create comment")
  }
})

// Cập nhật comment
export const updateComment = createAsyncThunk<
  Comment,
  { commentId: string; content: string },
  { rejectValue: string }
>("comments/update", async ({ commentId, content }, { rejectWithValue }) => {
  try {
    const res = await apiClient.put(`/comments/${commentId}`, { content })
    return res.data.comment || res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to update comment")
  }
})

// Xóa comment
export const deleteComment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("comments/delete", async (commentId, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/comments/${commentId}`)
    return commentId
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete comment")
  }
})

// Tạo reply cho comment
export const createReply = createAsyncThunk<
  Comment,
  { parentCommentId: string; content: string; recipeId: string },
  { rejectValue: string }
>("comments/createReply", async ({ parentCommentId, content, recipeId }, { rejectWithValue }) => {
  try {
    // Backend sử dụng endpoint /comments với parentCommentId trong body
    const res = await apiClient.post(`/comments`, { 
      content, 
      recipeId,
      parentCommentId // Gửi parentCommentId trong body
    })
    return res.data.comment || res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to create reply")
  }
})

// =====================
// SLICE
// =====================

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = []
      state.totalComments = 0
      state.error = null
    },
    clearCommentError: (state) => {
      state.error = null
    },
    // Update comment likes locally (sau khi like/unlike)
    updateCommentLikes: (state, action: PayloadAction<{ commentId: string; likes: number }>) => {
      const { commentId, likes } = action.payload
      
      // Tìm trong comments chính
      const comment = state.comments.find(c => c._id === commentId)
      if (comment) {
        comment.likes = likes
        return
      }
      
      // Nếu không tìm thấy, tìm trong replies
      for (const parentComment of state.comments) {
        if (parentComment.replies) {
          const reply = parentComment.replies.find(r => r._id === commentId)
          if (reply) {
            reply.likes = likes
            return
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // GET COMMENTS
      .addCase(getCommentsByRecipeId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCommentsByRecipeId.fulfilled, (state, action) => {
        state.loading = false
        state.comments = action.payload.comments
        state.totalComments = action.payload.total
      })
      .addCase(getCommentsByRecipeId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to load comments"
      })

      // CREATE COMMENT
      .addCase(createComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false
        state.comments.unshift(action.payload)
        state.totalComments += 1
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to create comment"
      })

      // UPDATE COMMENT
      .addCase(updateComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false
        const index = state.comments.findIndex(c => c._id === action.payload._id)
        if (index !== -1) {
          state.comments[index] = action.payload
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to update comment"
      })

      // DELETE COMMENT
      .addCase(deleteComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false
        state.comments = state.comments.filter(c => c._id !== action.payload)
        state.totalComments -= 1
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to delete comment"
      })

      // CREATE REPLY
      .addCase(createReply.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createReply.fulfilled, (state, action) => {
        state.loading = false
        const reply = action.payload
        
        // Tìm parent comment và thêm reply vào
        const parentComment = state.comments.find(c => c._id === reply.parentCommentId)
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = []
          }
          parentComment.replies.push(reply)
        }
        state.totalComments += 1
      })
      .addCase(createReply.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to create reply"
      })
  },
})

export const { clearComments, clearCommentError, updateCommentLikes } = commentSlice.actions
export default commentSlice.reducer
