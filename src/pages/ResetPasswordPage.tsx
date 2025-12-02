import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { resetPassword, clearError } from "../redux/slices/authSlice"
import { useLanguage } from "../contexts/LanguageContext"

interface ResetPasswordPageProps {
  onBack?: () => void
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onBack }) => {
  const { t } = useLanguage()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { token: paramToken } = useParams<{ token: string }>()
  const [searchParams] = useSearchParams()
  const queryToken = searchParams.get("token")
  
  // Hỗ trợ cả 2 cách
  const token = paramToken || queryToken
  
  const { loading, error } = useSelector((state: RootState) => state.auth)
  
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {

    
    // Clear error khi component mount
    dispatch(clearError())
    
    // Kiểm tra có token không
    if (!token) {
      navigate("/forgot-password")
    }
  }, [dispatch, token, navigate, paramToken, queryToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    setSuccessMessage(null)

    // Validation
    if (newPassword.length < 6) {
      setValidationError(t("auth.passwordTooShort"))
      return
    }

    if (newPassword !== confirmPassword) {
      setValidationError(t("auth.passwordNotMatch"))
      return
    }

    if (!token) {
      setValidationError(t("auth.resetPasswordError"))
      return
    }
    
    try {
      await dispatch(resetPassword({ token, newPassword })).unwrap()
      setSuccessMessage(t("auth.resetPasswordSuccess"))
      
      // Chuyển về trang login sau 2 giây
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      // Error đã được handle trong Redux
      console.error("Reset password error:", err)
    }
  }

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

        {/* Auth Card */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="text-center mb-4 lg:mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2.5 lg:p-3 rounded-xl inline-block mb-3 lg:mb-4">
              <Lock className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">{t("auth.resetPassword")}</h1>
            <p className="text-gray-600 text-xs lg:text-sm">{t("auth.resetPasswordFormDesc")}</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-3 lg:mb-4 p-2.5 lg:p-3 rounded-lg flex items-center space-x-2 text-xs lg:text-sm bg-green-50 border border-green-200 text-green-800">
              <div className="flex-shrink-0">
                <CheckCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </div>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {(error || validationError) && (
            <div className="mb-3 lg:mb-4 p-2.5 lg:p-3 rounded-lg flex items-center space-x-2 text-xs lg:text-sm bg-red-50 border border-red-200 text-red-800">
              <div className="flex-shrink-0">
                <AlertCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </div>
              <span>{validationError || (error === "auth.resetPasswordError" ? t("auth.resetPasswordError") : t("auth.resetLinkError"))}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5">{t("auth.newPassword")}</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading || !!successMessage}
                  className="w-full pl-8 lg:pl-9 pr-9 py-2 lg:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-xs lg:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading || !!successMessage}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5">{t("auth.confirmNewPassword")}</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || !!successMessage}
                  className="w-full pl-8 lg:pl-9 pr-9 py-2 lg:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-xs lg:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading || !!successMessage}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !newPassword.trim() || !confirmPassword.trim() || !!successMessage}
              className={`w-full py-2 lg:py-2.5 px-4 rounded-lg font-medium text-white text-xs lg:text-sm transition-all duration-200 ${
                loading || !newPassword.trim() || !confirmPassword.trim() || !!successMessage
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("auth.resetting")}</span>
                </div>
              ) : (
                t("auth.resetPasswordButton")
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 lg:mt-5 text-center">
            <div className="text-gray-600 text-xs lg:text-sm">
              {t("auth.rememberPassword")}{" "}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200">
                {t("auth.backToLogin")}
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 lg:mt-4 text-center text-xs text-gray-500">
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

export default ResetPasswordPage
