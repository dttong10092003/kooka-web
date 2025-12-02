import type React from "react"
import { useState } from "react"
import { ArrowLeft, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import FormInput from "../components/FormInput"
import GoogleLoginButton from "../components/GoogleLoginButton"
import { useLanguage } from "../contexts/LanguageContext"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { login } from "../redux/slices/authSlice"
import axiosInstance from "../utils/axiosInstance"
import toast from "react-hot-toast"
import { persistor } from "../redux/store"

interface LoginPageProps {
  onBack?: () => void
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { error, isVerified, pendingVerificationEmail } = useSelector((state: RootState) => state.auth)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResendEmail = async () => {
    if (!pendingVerificationEmail) return;
    
    setIsResending(true);
    try {
      await axiosInstance.post("/auth/resend-verification", { 
        email: pendingVerificationEmail 
      });
      toast.success("Email xác thực đã được gửi lại!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setButtonLoading(true);
    setShowSuccess(false);

    try {
      const result = await dispatch(
        login({
          usernameOrEmail: formData.email,
          password: formData.password,
        })
      );

      //  FIX: Kiểm tra rõ ràng login thành công hay thất bại
      if (login.fulfilled.match(result)) {
        // Login thành công
        setShowSuccess(true);
        
        // Delay 1s rồi chuyển trang
        setTimeout(() => {
          const isAdmin = result.payload.user?.isAdmin;
          if (isAdmin) {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 1000);
        
        // ⚠️ KHÔNG TẮT buttonLoading ở đây để giữ UI loading cho đến khi navigate
      } else if (login.rejected.match(result)) {
        // Login thất bại - STOP loading ngay lập tức
        
        //  FIX: TẮT loading ngay khi login failed
        setButtonLoading(false);
        
        // Clear persisted data
        await persistor.purge();
        
        // Error message sẽ hiển thị tự động từ Redux state
      }
    } catch (err) {
      // Lỗi không mong đợi
      console.error("❌ Login error:", err);
      
      //  FIX: TẮT loading khi có lỗi
      setButtonLoading(false);
      await persistor.purge();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-4 lg:py-8 flex items-center">
      <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-3 lg:mb-4 flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("auth.back")}</span>
          </button>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="text-center mb-4 lg:mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2.5 lg:p-3 rounded-xl inline-block mb-3 lg:mb-4">
              <Lock className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">{t("auth.welcome")}</h1>
            <p className="text-gray-600 text-xs lg:text-sm">{t("auth.signinToAccount")}</p>
          </div>

          {/* Error Message */}
          {error && !showSuccess && (
            <div className="mb-3 lg:mb-4 p-2.5 lg:p-3 rounded-lg text-xs lg:text-sm bg-red-50 border border-red-200 text-red-800">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4 flex-shrink-0" />
                <span>{t(error)}</span>
              </div>
              {isVerified === false && pendingVerificationEmail && (
                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="mt-2 w-full py-2 px-3 rounded-md text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? "Đang gửi..." : "🔄 Gửi lại email xác thực"}
                </button>
              )}
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-3 lg:mb-4 p-2.5 lg:p-3 rounded-lg flex items-center space-x-2 text-xs lg:text-sm bg-green-50 border border-green-200 text-green-800">
              <CheckCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span>{t("auth.loginSuccess")}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <FormInput
              label={t("auth.email")}
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              icon={Mail}
              required
            />

            {/* Password */}
            <FormInput
              label={t("auth.password")}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={buttonLoading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-white text-sm transition-all duration-200 ${
                buttonLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl cursor-pointer"
              }`}
            >
              {buttonLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("auth.signingIn")}</span>
                </div>
              ) : (
                t("auth.signin")
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 lg:mt-5 text-center space-y-2 lg:space-y-3">
            <Link
              to="/forgot-password"
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 text-xs lg:text-sm"
            >
              {t("auth.forgotPassword")}
            </Link>
            <div className="text-gray-600 text-xs lg:text-sm">
              {t("auth.noAccount")}{" "}
              <Link
                to="/register"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                {t("auth.signup")}
              </Link>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-4 lg:mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 lg:px-3 bg-white text-gray-500 text-xs">{t("auth.or")}</span>
              </div>
            </div>

            <div className="mt-3 lg:mt-4">
              <GoogleLoginButton 
                text="continue_with" 
                onSuccess={() => {
                  navigate("/")
                }} 
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 lg:mt-5 text-center text-xs text-gray-500">
          <p>
            {t("auth.agree")}{" "}
            <a href="#" className="text-orange-600 hover:text-orange-700">
              {t("auth.terms")}
            </a>{" "}
            {t("auth.and")}{" "}
            <a href="#" className="text-orange-600 hover:text-orange-700">
              {t("auth.privacy")}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage