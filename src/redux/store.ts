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
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import recipeReducer from "./slices/recipeSlice";
import userReducer from "./slices/userSlice";

// Cấu hình persist - Lưu auth và user vào localStorage
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "user"], // Chỉ persist auth và user, không persist recipes
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  recipes: recipeReducer,
  user: userReducer,
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
