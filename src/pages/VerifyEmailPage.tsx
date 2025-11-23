import type React from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { CheckCircle, AlertCircle, Loader } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

type VerifyStatus = "verifying" | "success" | "error"

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [status, setStatus] = useState<VerifyStatus>("verifying")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      const tokenFromUrl = searchParams.get("token")
      
      if (!tokenFromUrl) {
        setStatus("error")
        setMessage("Token không hợp lệ. Vui lòng kiểm tra lại link trong email.")
        return
      }
      
      try {
        // Backend expects GET request with token in query params
        const response = await axiosInstance.get(`/auth/verify-email?token=${tokenFromUrl}`)
        
        setStatus("success")
        setMessage(response.data.message || "Xác thực email thành công!")
        
        // Chuyển hướng đến trang login sau 3 giây
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "Tài khoản đã được kích hoạt! Bạn có thể đăng nhập ngay bây giờ.",
              verified: true
            } 
          })
        }, 3000)
      } catch (error: any) {
        setStatus("error")
        setMessage(error.response?.data?.message || "Có lỗi xảy ra khi xác thực email")
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 flex items-center" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8" style={{ minHeight: '300px' }}>
          
          {/* Verifying State */}
          {status === "verifying" && (
            <div className="text-center py-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full inline-block mb-4">
                <Loader className="h-8 w-8 text-white animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Đang xác thực email...
              </h2>
              <p className="text-gray-600 text-sm">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="text-center py-8">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                 Xác thực thành công!
              </h2>
              <p className="text-gray-700 mb-4">{message}</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Đang chuyển hướng đến trang đăng nhập...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="text-center py-8">
              <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ❌ Xác thực thất bại
              </h2>
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">{message}</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 px-4 rounded-lg font-medium text-white text-sm bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Về trang đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-3 px-4 rounded-lg font-medium text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  Đăng ký lại
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Help Text */}
        {status === "error" && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Gặp vấn đề? Vui lòng liên hệ với chúng tôi để được hỗ trợ.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailPage
