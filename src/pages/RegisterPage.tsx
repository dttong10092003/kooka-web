import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Mail, Lock, User, CheckCircle, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import FormInput from "../components/FormInput"
import GoogleLoginButton from "../components/GoogleLoginButton"
import VerifyEmailModal from "../components/VerifyEmailModal"
import { useLanguage } from "../contexts/LanguageContext"

// Redux
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { registerUser, clearError } from "../redux/slices/authSlice"

interface RegisterPageProps {
  onBack?: () => void
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error} = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    agreeToTerms: false,
  })

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState("")
  const [validationErrors, setValidationErrors] = useState({
    password: "",
    confirmPassword: "",
  })

  // Tự động xóa lỗi sau 5 giây
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  // Xóa lỗi khi unmount (chuyển trang)
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear validation errors when user types
    if (name === "password" || name === "confirmPassword") {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = (): boolean => {
    const errors = {
      password: "",
      confirmPassword: "",
    }

    // Validate password length
    if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    setValidationErrors(errors)
    return !errors.password && !errors.confirmPassword
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validate form before submitting
    if (!validateForm()) {
      return
    }

    const result = await dispatch(
      registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    )

    // Xử lý kết quả đăng ký
    if (registerUser.fulfilled.match(result)) {
      // Kiểm tra nếu cần verify email
      if (result.payload.needVerification) {
        // Hiển thị modal thông báo kiểm tra email
        setVerifyEmail(result.payload.user.email || formData.email)
        setShowVerifyModal(true)
      } else if (result.payload.token) {
        // Đăng ký thành công và có token ngay (Google OAuth)
        setMessage({ type: "success", text: "auth.registerSuccess" })
        setTimeout(() => {
          navigate("/")
        }, 1500)
      }
    }
  }

  // Khi có lỗi
  useEffect(() => {
    if (error) {
      setMessage({ type: "error", text: error })
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-4 lg:py-6 flex items-center">
      <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-2 lg:mb-3 flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 text-sm"
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
              <User className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">{t("auth.createAccount")}</h1>
            <p className="text-gray-600 text-xs lg:text-sm">{t("auth.johnComunity")}</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-3 lg:mb-4 p-2.5 lg:p-3 rounded-lg flex items-center space-x-2 text-xs lg:text-sm ${message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
                }`}
            >
              <div className="flex-shrink-0">
                {message.type === "success" ? (
                  <CheckCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                )}
              </div>
              <span>{t(message.text)}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label={t("auth.firstname")}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                icon={User}
                required
              />
              <FormInput
                label={t("auth.lastname")}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                icon={User}
                required
              />
            </div>

            <FormInput
              label={t("auth.email")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              icon={Mail}
              required
            />

            <div>
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
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <FormInput
                label={t("auth.confirmPassword")}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                icon={Lock}
                required
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
                className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
              />
              <label className="text-sm text-gray-600 leading-tight">
                {t("auth.clause")}{" "}
                <Link to="/terms-of-service" className="text-orange-600 hover:text-orange-700 font-medium">
                  {t("auth.term")}
                </Link>{" "}
                {t("auth.and")}{" "}
                <Link to="/privacy-policy" className="text-orange-600 hover:text-orange-700 font-medium">
                  {t("auth.privacyPolicy")}
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-white text-sm transition-all duration-200 cursor-pointer ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("auth.createIn")}</span>
                </div>
              ) : (
                t("auth.createAccount")
              )}
            </button>
          </form>

          <div className="mt-3 lg:mt-4 text-center">
            <div className="text-gray-600 text-xs lg:text-sm">
              {t("auth.alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                {t("auth.signin")}
              </Link>
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
        </div>
      </div>

      {/* Verify Email Modal */}
      <VerifyEmailModal 
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        email={verifyEmail}
      />
    </div>
  )
}

export default RegisterPage
