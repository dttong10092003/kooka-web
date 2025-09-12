import type React from "react"
import { useState } from "react"
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

interface ForgotPasswordPageProps {
  onBack?: () => void
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Simulate API call
    setTimeout(() => {
      setMessage({ type: "success", text: "Password reset link sent to your email!" })
      setIsLoading(false)
    }, 2000)
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
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">Reset Password</h1>
            <p className="text-gray-600 text-xs lg:text-sm">Enter your email to reset your password</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-3 lg:mb-4 p-2.5 lg:p-3 rounded-lg flex items-center space-x-2 text-xs lg:text-sm ${
                message.type === "success"
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
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-8 lg:pl-9 pr-3 py-2 lg:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-xs lg:text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 lg:py-2.5 px-4 rounded-lg font-medium text-white text-xs lg:text-sm transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3.5 h-3.5 lg:w-4 lg:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 lg:mt-5 text-center">
            <div className="text-gray-600 text-xs lg:text-sm">
              Remember your password?{" "}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200">
                Sign in
              </Link>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-3 lg:mt-4 p-3 lg:p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-center">
              <h3 className="text-xs lg:text-sm font-medium text-orange-800 mb-1.5">Need help?</h3>
              <p className="text-xs text-orange-700 mb-2">
                If you don't receive an email within a few minutes, check your spam folder or contact support.
              </p>
              <a href="#" className="text-orange-600 hover:text-orange-700 font-medium text-xs lg:text-sm">
                Contact Support
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
