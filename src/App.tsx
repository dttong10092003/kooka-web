import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";

// USer
import ProfilePage from "./pages/ProfilePage";
import MyReviews from "./pages/MyReviews";
import ProfileLayout from "./layout/ProfileLayout";
import Settings from "./pages/Settings";
import MyFavourite from "./pages/MyFavourite";

function App() {
  const location = useLocation();

  // Ẩn header khi ở /admin
  const hideHeader = location.pathname.startsWith("/admin");
  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Group user pages dưới ProfileLayout */}
        <Route path="/" element={<ProfileLayout />}>
          <Route path="my-profile" element={<ProfilePage />} />
          <Route path="my-reviews" element={<MyReviews />} />
          <Route path="my-settings" element={<Settings />} />
          <Route path="my-favorites" element={<MyFavourite />} />
        </Route>
      </Routes>
      {!hideHeader && <Footer />}
    </>
  );
}

export default App;
