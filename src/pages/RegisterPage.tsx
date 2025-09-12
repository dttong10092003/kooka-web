import type React from "react"
import { useState } from "react"
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

interface RegisterPageProps {
  onBack?: () => void
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
    setIsLoading(true)
    setMessage(null)

    // Simulate API call
    setTimeout(() => {
      setMessage({ type: "success", text: "Account created successfully! Please check your email." })
      setIsLoading(false)
    }, 2000)
  }

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
            <span>Back to Home</span>
          </button>
        )}

        {/* Auth Card */}
        <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4 lg:p-5">
          {/* Header */}
          <div className="text-center mb-3 lg:mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 lg:p-2.5 rounded-xl inline-block mb-2 lg:mb-3">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">Create Account</h1>
            <p className="text-gray-600 text-xs">Join our community of food lovers</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-2 lg:mb-3 p-2 lg:p-2.5 rounded-lg flex items-center space-x-2 text-xs ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex-shrink-0">
                {message.type === "success" ? (
                  <CheckCircle className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                ) : (
                  <AlertCircle className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                )}
              </div>
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-7 lg:pl-8 pr-2 py-1.5 lg:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-xs"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-7 lg:pl-8 pr-2 py-1.5 lg:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-xs"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-7 lg:pl-8 pr-2 py-1.5 lg:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-xs"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-7 lg:pl-8 pr-8 lg:pr-9 py-1.5 lg:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-xs"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-3 w-3 lg:h-3.5 lg:w-3.5"/>
                  ) : (
                    <Eye className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-7 lg:pl-8 pr-8 lg:pr-9 py-1.5 lg:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-xs"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                  ) : (
                    <Eye className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
                className="mt-0.5 h-3 w-3 lg:h-3.5 lg:w-3.5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
              />
              <label className="text-xs text-gray-600 leading-tight">
                I agree to the{" "}
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-1.5 lg:py-2 px-4 rounded-lg font-medium text-white text-xs transition-all duration-200 cursor-pointer ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 lg:w-3.5 lg:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-3 lg:mt-4 text-center">
            <div className="text-gray-600 text-xs">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200">
                Sign in
              </Link>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-3 lg:mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 text-xs">Or continue with</span>
              </div>
            </div>

            <div className="mt-2 lg:mt-3 grid grid-cols-2 gap-2">
              <button className="w-full inline-flex justify-center py-1.5 px-2 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" viewBox="0 0 24 24">
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
                <span className="ml-1">Google</span>
              </button>

              <button className="w-full inline-flex justify-center py-1.5 px-2 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-1">Facebook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 lg:mt-4 text-center text-xs text-gray-500">
          <p>
            By creating an account, you agree to our{" "}
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

export default RegisterPage
