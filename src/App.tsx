import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { loadUser } from "./redux/slices/authSlice";
import { fetchProfile } from "./redux/slices/userSlice";
import Home from "./pages/Home";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";

// USer
import ProfilePage from "./pages/ProfilePage";
import MyReviews from "./pages/MyReviews";
import ProfileLayout from "./layout/ProfileLayout";
import Settings from "./pages/Settings";
import MyFavourite from "./pages/MyFavourite";
import GoogleCallback from "./pages/GoogleCallback";
import About from "./pages/About";
import MealPlannerPage from "./pages/MealPlannerPage";
import AIChatBot from "./components/AIChatBot";

function App() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);

  // Auto-load user data khi có token nhưng chưa có user
  useEffect(() => {
    if (token && !user) {
      console.log("📡 Loading user data with token...");
      dispatch(loadUser()).catch((err) => {
        console.error("❌ Failed to load user:", err);
        // Nếu load user thất bại, clear token
        localStorage.removeItem("token");
        localStorage.removeItem("persist:root");
      });
    }
  }, [dispatch, token, user]);

  // Auto-load profile data when user is available but profile is not
  useEffect(() => {
    if (user?._id && !profile) {
      dispatch(fetchProfile(user._id));
    }
  }, [dispatch, user, profile]);

  // Ẩn header khi ở /admin
  const hideHeader = location.pathname.startsWith("/admin");
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/meal-planner" element={<MealPlannerPage />} />


        {/* Group user pages dưới ProfileLayout */}
        <Route path="/" element={<ProfileLayout />}>
          <Route path="my-profile" element={<ProfilePage />} />
          <Route path="my-reviews" element={<MyReviews />} />
          <Route path="my-settings" element={<Settings />} />
          <Route path="my-favorites" element={<MyFavourite />} />
        </Route>
      </Routes>
      {!hideHeader && <Footer />}
      <AIChatBot />
    </>
  );
}

export default App;
