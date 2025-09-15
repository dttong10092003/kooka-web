import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";

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
      </Routes>
      {!hideHeader && <Footer />}
    </>
  );
}

export default App;
