import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiClient } from "./authSlice"

// =====================
// TYPES
// =====================

interface Favorite {
  _id: string
  recipeId: string
  userId: string
  createdAt: string
}

interface FavoriteState {
  favorites: Favorite[]
  favoriteRecipeIds: string[]  // Changed from Set to Array for Redux serialization
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// =====================
// INITIAL STATE
// =====================

const initialState: FavoriteState = {
  favorites: [],
  favoriteRecipeIds: [],  // Changed from Set to Array
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
}

// =====================
// API CALLS
// =====================

// Toggle favorite (add/remove)
export const toggleFavorite = createAsyncThunk<
  { favorited: boolean; message: string; favorites: number; recipeId: string },
  { recipeId: string },
  { rejectValue: string }
>("favorite/toggle", async ({ recipeId }, { rejectWithValue }) => {
  try {
    const res = await apiClient.post("/favorites/toggle", { recipeId })
    return { ...res.data, recipeId }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to toggle favorite")
  }
})

// Get user's favorites
export const getUserFavorites = createAsyncThunk<
  { favorites: Favorite[]; pagination: any },
  { userId: string; page?: number; limit?: number },
  { rejectValue: string }
>("favorite/getUserFavorites", async ({ userId, page = 1, limit = 20 }, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(`/favorites/user/${userId}?page=${page}&limit=${limit}`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to get favorites")
  }
})

// Check if user favorited a recipe
export const checkUserFavorited = createAsyncThunk<
  { favorited: boolean; recipeId: string; userId: string },
  { recipeId: string; userId: string },
  { rejectValue: string }
>("favorite/checkUserFavorited", async ({ recipeId, userId }, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(`/favorites/recipe/${recipeId}/user/${userId}`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to check favorite")
  }
})

// Check multiple recipes at once
export const checkMultipleRecipes = createAsyncThunk<
  Array<{ recipeId: string; favorited: boolean }>,
  { recipeIds: string[] },
  { rejectValue: string }
>("favorite/checkMultipleRecipes", async ({ recipeIds }, { rejectWithValue }) => {
  try {
    const res = await apiClient.post("/favorites/check-multiple", { recipeIds })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to check favorites")
  }
})

// Get favorite count for a recipe
export const getFavoriteCount = createAsyncThunk<
  { recipeId: string; count: number },
  { recipeId: string },
  { rejectValue: string }
>("favorite/getFavoriteCount", async ({ recipeId }, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(`/favorites/recipe/${recipeId}/count`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to get favorite count")
  }
})

// =====================
// SLICE
// =====================

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = []
      state.favoriteRecipeIds = []
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // TOGGLE FAVORITE
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false
        const { recipeId, favorited } = action.payload
        
        if (favorited) {
          if (!state.favoriteRecipeIds.includes(recipeId)) {
            state.favoriteRecipeIds.push(recipeId)
          }
        } else {
          state.favoriteRecipeIds = state.favoriteRecipeIds.filter(id => id !== recipeId)
          // Remove from favorites list if exists
          state.favorites = state.favorites.filter(fav => fav.recipeId !== recipeId)
          state.pagination.total = Math.max(0, state.pagination.total - 1)
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to toggle favorite"
      })

      // GET USER FAVORITES
      .addCase(getUserFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.favorites = action.payload.favorites
        state.pagination = action.payload.pagination
        // Update favoriteRecipeIds
        state.favoriteRecipeIds = action.payload.favorites.map((fav: Favorite) => fav.recipeId)
      })
      .addCase(getUserFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to get favorites"
      })

      // CHECK USER FAVORITED
      .addCase(checkUserFavorited.pending, (state) => {
        state.loading = true
      })
      .addCase(checkUserFavorited.fulfilled, (state, action) => {
        state.loading = false
        const { recipeId, favorited } = action.payload
        if (favorited) {
          if (!state.favoriteRecipeIds.includes(recipeId)) {
            state.favoriteRecipeIds.push(recipeId)
          }
        } else {
          state.favoriteRecipeIds = state.favoriteRecipeIds.filter(id => id !== recipeId)
        }
      })
      .addCase(checkUserFavorited.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to check favorite"
      })

      // CHECK MULTIPLE RECIPES
      .addCase(checkMultipleRecipes.pending, (state) => {
        state.loading = true
      })
      .addCase(checkMultipleRecipes.fulfilled, (state, action) => {
        state.loading = false
        action.payload.forEach(({ recipeId, favorited }) => {
          if (favorited) {
            if (!state.favoriteRecipeIds.includes(recipeId)) {
              state.favoriteRecipeIds.push(recipeId)
            }
          } else {
            state.favoriteRecipeIds = state.favoriteRecipeIds.filter(id => id !== recipeId)
          }
        })
      })
      .addCase(checkMultipleRecipes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to check favorites"
      })

      // GET FAVORITE COUNT
      .addCase(getFavoriteCount.pending, (state) => {
        state.loading = true
      })
      .addCase(getFavoriteCount.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getFavoriteCount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to get favorite count"
      })
  },
})

export const { clearFavorites, clearError } = favoriteSlice.actions
export default favoriteSlice.reducer
