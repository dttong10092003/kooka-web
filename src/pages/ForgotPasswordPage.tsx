import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { forgotPassword, clearError } from "../redux/slices/authSlice"
import { useLanguage } from "../contexts/LanguageContext"

interface ForgotPasswordPageProps {
  onBack?: () => void
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
  const { t } = useLanguage()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)
  
  const [email, setEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    // Clear error khi component mount
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)
    
    try {
      await dispatch(forgotPassword({ email })).unwrap()
      setSuccessMessage(t("auth.resetLinkSent"))
      setEmail("") // Clear email sau khi gửi thành công
    } catch (err) {
      // Error đã được handle trong Redux
      console.error("Forgot password error:", err)
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
            <span>Back to Home</span>
          </button>
        )}

        {/* Auth Card */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="text-center mb-4 lg:mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2.5 lg:p-3 rounded-xl inline-block mb-3 lg:mb-4">
              <Mail className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">{t("auth.resetPasswordTitle")}</h1>
            <p className="text-gray-600 text-xs lg:text-sm">{t("auth.resetPasswordDesc")}</p>
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
          {error && (
            <div className="mb-3 lg:mb-4 p-2.5 lg:p-3 rounded-lg flex items-center space-x-2 text-xs lg:text-sm bg-red-50 border border-red-200 text-red-800">
              <div className="flex-shrink-0">
                <AlertCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </div>
              <span>{error === "auth.emailNotFound" ? t("auth.emailNotFound") : t("auth.resetLinkError")}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5">{t("auth.email")}</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-8 lg:pl-9 pr-3 py-2 lg:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-xs lg:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className={`w-full py-2 lg:py-2.5 px-4 rounded-lg font-medium text-white text-xs lg:text-sm transition-all duration-200 ${
                loading || !email.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("auth.sending")}</span>
                </div>
              ) : (
                t("auth.sendResetLink")
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 lg:mt-5 text-center">
            <div className="text-gray-600 text-xs lg:text-sm">
              {t("auth.rememberPassword")}{" "}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200">
                {t("auth.signin")}
              </Link>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-3 lg:mt-4 p-3 lg:p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-center">
              <h3 className="text-xs lg:text-sm font-medium text-orange-800 mb-1.5">{t("auth.needHelp")}</h3>
              <p className="text-xs text-orange-700 mb-2">
                {t("auth.checkSpam")}
              </p>
              <a href="#" className="text-orange-600 hover:text-orange-700 font-medium text-xs lg:text-sm">
                {t("auth.contactSupport")}
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 lg:mt-4 text-center text-xs text-gray-500">
          <p>
            By using our service, you agree to our{" "}
            <a href="#" className="text-orange-600 hover:text-orange-700">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-orange-600 hover:text-orange-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
