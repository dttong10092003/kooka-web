import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { loadUser } from "./redux/slices/authSlice";
import { fetchProfile } from "./redux/slices/userSlice";
import { fetchTopRatedRecipes, fetchTrendingRecipes, fetchRecipes } from "./redux/slices/recipeSlice";
import { fetchTopComments, fetchNewestComments } from "./redux/slices/commentSlice";
import { fetchMostFavorited } from "./redux/slices/favoriteSlice";
import Home from "./pages/Home";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AdminDashboard from "./pages/AdminDashboard";
import DataManagement from "./pages/DataManagement";
import Footer from "./components/Footer";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import AllRecipes from "./pages/AllRecipes";

// User
import ProfilePage from "./pages/ProfilePage";
import MyReviews from "./pages/MyReviews";
import SuggestRecipe from "./pages/SuggestRecipe";
import PendingRecipes from "./pages/PendingRecipes";
import ProfileLayout from "./layout/ProfileLayout";
import Settings from "./pages/Settings";
import MyFavourite from "./pages/MyFavourite";
import GoogleCallback from "./pages/GoogleCallback";
import About from "./pages/About";
import MealPlannerPage from "./pages/MealPlannerPage";
import Categories from "./pages/Categories";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AIChatBot from "./components/AIChatBot";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { token, user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);
  const { topRatedRecipes, trendingRecipes, recipes } = useSelector((state: RootState) => state.recipes);
  const { topComments, newestComments } = useSelector((state: RootState) => state.comments);
  const { mostFavorited } = useSelector((state: RootState) => state.favorites);

  //  FIX: Dùng ref để track xem đã attempt load user chưa
  const hasAttemptedLoadUser = useRef(false);

  // Load all necessary data once when app starts up
  useEffect(() => {
    if (recipes.length === 0) {
      dispatch(fetchRecipes());
    }
    
    if (topRatedRecipes.length === 0) {
      dispatch(fetchTopRatedRecipes(6));
    }
    if (trendingRecipes.length === 0) {
      dispatch(fetchTrendingRecipes());
    }
    if (topComments.length === 0) {
      dispatch(fetchTopComments());
    }
    if (newestComments.length === 0) {
      dispatch(fetchNewestComments());
    }
    if (mostFavorited.length === 0) {
      dispatch(fetchMostFavorited());
    }
  }, [dispatch, recipes.length, topRatedRecipes.length, trendingRecipes.length, topComments.length, newestComments.length, mostFavorited.length]);

  //  FIX: Auto-load user với logic cải tiến
  useEffect(() => {
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    

    if (token && !user && !isAuthPage && !hasAttemptedLoadUser.current && !authLoading) {
      console.log("📡 Loading user data with token...");
      hasAttemptedLoadUser.current = true;
      
      dispatch(loadUser()).unwrap().catch((err) => {
        console.error("❌ Failed to load user:", err);
        // Clear token nếu invalid
        localStorage.removeItem("token");
        localStorage.removeItem("persist:root");
        // FIX: KHÔNG reload trang nữa - để user ở lại trang hiện tại
        // User sẽ thấy họ đã bị logout nhưng không bị redirect
      });
    }
    
    // FIX: Reset flag khi token bị clear (logout)
    if (!token) {
      hasAttemptedLoadUser.current = false;
    }
  }, [dispatch, token, user, location.pathname, authLoading]);

  // Auto-load profile data when user is available but profile is not
  useEffect(() => {
    if (user?._id && !profile) {
      dispatch(fetchProfile(user._id));
    }
  }, [dispatch, user, profile]);

  // Ẩn header và chatbot khi ở /admin
  const hideHeader = location.pathname.startsWith("/admin");
  const hideChatBot = location.pathname.startsWith("/admin");
  
  return (
    <>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            marginTop: '40px',
          },
        }}
      />
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:type" element={<AllRecipes />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/data-management" element={
          <ProtectedRoute requireAdmin={true}>
            <DataManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/pending-recipes" element={
          <ProtectedRoute requireAdmin={true}>
            <PendingRecipes />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/meal-planner" element={<MealPlannerPage />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Group user pages dưới ProfileLayout */}
        <Route path="/" element={
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        }>
          <Route path="my-profile" element={<ProfilePage />} />
          <Route path="my-reviews" element={<MyReviews />} />
          <Route path="my-suggest-recipe" element={<SuggestRecipe />} />
          <Route path="my-settings" element={<Settings />} />
          <Route path="my-favorites" element={<MyFavourite />} />
        </Route>
      </Routes>
      {!hideHeader && <Footer />}
      <ScrollToTop />
      {!hideChatBot && <AIChatBot />}
    </>
  );
}

export default App;