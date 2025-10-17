import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const GoogleCallback: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const hasProcessed = useRef(false) // Prevent double processing

  useEffect(() => {
    // Chỉ xử lý một lần duy nhất
    if (hasProcessed.current) return
    hasProcessed.current = true

    // Parse URL parameters hoặc handle kết quả từ Google OAuth
    const urlParams = new URLSearchParams(location.search)
    const token = urlParams.get('token')
    const error = urlParams.get('error')

    console.log("🔍 GoogleCallback - Processing:", { token: token ? "exists" : "none", error, isPopup: !!window.opener })

    if (window.opener) {
      if (token) {
        // Parse user data từ URL hoặc từ response
        const userData = {
          // Bạn có thể decode JWT token ở đây để lấy user info
          token: token
        }
        
        // Gửi thông tin thành công về parent window
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_SUCCESS',
          payload: userData
        }, window.location.origin)
      } else if (error) {
        // Gửi lỗi về parent window
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: error
        }, window.location.origin)
      }
      
      // Đóng popup
      setTimeout(() => window.close(), 500)
    } else {
      // Nếu không phải popup, redirect về trang chủ ngay lập tức
      // Replace thay vì push để tránh quay lại trang này
      navigate('/', { replace: true })
    }
  }, []) // Empty dependency array - chỉ chạy 1 lần

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý đăng nhập Google...</p>
      </div>
    </div>
  )
}

export default GoogleCallback