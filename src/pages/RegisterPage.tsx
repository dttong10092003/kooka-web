import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Mail, Lock, User, CheckCircle, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import FormInput from "../components/FormInput"
import { useLanguage } from "../contexts/LanguageContext"

// Redux
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { registerUser } from "../redux/slices/authSlice"

interface RegisterPageProps {
  onBack?: () => void
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, user, token } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    agreeToTerms: false,
  })

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    dispatch(
      registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    )
  }

  // Khi đăng ký thành công
  useEffect(() => {
    if (user && token) {
      setMessage({ type: "success", text: "auth.registerSuccess" })
      setTimeout(() => {
        navigate("/") // hoặc "/dashboard"
      }, 1500)
    }
  }, [user, token, navigate])


  // Khi có lỗi
  useEffect(() => {
    if (error) {
      setMessage({ type: "error", text: error }) // error cũng là key (vd: auth.passwordNotMatch)
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
            {/* Name Fields */}
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

            {/* Terms and Conditions */}
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
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                  {t("auth.term")}
                </a>{" "}
                {t("auth.and")}{" "}
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                  {t("auth.privacyPolicy")}
                </a>
              </label>
            </div>

            {/* Submit Button */}
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

          {/* Footer Links */}
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
          </div>

          {/* Social Login */}
          <div className="mt-4 lg:mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 lg:px-3 bg-white text-gray-500 text-xs">{t("auth.orContinueWith")}</span>
              </div>
            </div>

            <div className="mt-3 lg:mt-4 grid grid-cols-2 gap-2">
              <button className="w-full inline-flex justify-center py-2 px-2 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-1.5">Google</span>
              </button>

              <button className="w-full inline-flex justify-center py-2 px-2 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-1.5">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
