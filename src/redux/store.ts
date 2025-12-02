import { configureStore } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import recipeReducer from "./slices/recipeSlice";
import userReducer from "./slices/userSlice";
import commentReducer from "./slices/commentSlice";
import likeReducer from "./slices/likeSlice";
import favoriteReducer from "./slices/favoriteSlice";
import mealPlanReducer from "./slices/mealPlanSlice";
import notificationReducer from "./slices/notificationSlice";

// Cấu hình persist - Lưu auth và user vào localStorage
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "user"], 
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  recipes: recipeReducer,
  user: userReducer,
  comments: commentReducer,
  likes: likeReducer,
  favorites: favoriteReducer,
  mealPlans: mealPlanReducer,
  notifications: notificationReducer,
});

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store với persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Tạo persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
