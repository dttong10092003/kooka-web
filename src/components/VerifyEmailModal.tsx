import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, CheckCircle, X, Send } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"
import toast from "react-hot-toast"

interface VerifyEmailModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({ isOpen, onClose, email }) => {
  const navigate = useNavigate()
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10)
      
      // Auto redirect to login after 5 seconds
      const redirectTimer = setTimeout(() => {
        navigate("/login")
      }, 5000)

      return () => clearTimeout(redirectTimer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen, navigate])

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Không tìm thấy email")
      return
    }

    setIsResending(true)
    setResendSuccess(false)

    try {
      await axiosInstance.post("/auth/resend-verification", { email })
      setResendSuccess(true)
      toast.success("Email xác thực đã được gửi lại!")
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi gửi lại email"
      toast.error(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay with blur effect - Lighter to see background */}
      <div 
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      
      {/* Modal - Compact size */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full relative z-10 transform transition-all duration-300 ${
          isVisible 
            ? "scale-100 opacity-100 translate-y-0" 
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon & Title */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Kiểm tra Email
            </h2>
            <p className="text-sm text-gray-600">
              Chúng tôi đã gửi link xác thực đến
            </p>
          </div>

          {/* Email display */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center space-x-2">
              <Send className="h-4 w-4 text-orange-600" />
              <p className="font-semibold text-orange-700 text-sm break-all text-center">
                {email}
              </p>
            </div>
          </div>

          {/* Success Message */}
          {resendSuccess && (
            <div className="mb-4 p-3 rounded-lg flex items-center space-x-2 text-sm bg-green-50 border border-green-200 text-green-700">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>Đã gửi lại email!</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                isResending
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {isResending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi...</span>
                </div>
              ) : (
                " Gửi lại email"
              )}
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              Đóng
            </button>
          </div>

          {/* Help text */}
          <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
            Kiểm tra cả thư mục spam. Link có hiệu lực trong 24 giờ.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailModal