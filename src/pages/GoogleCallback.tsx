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

    // Parse URL parameters từ backend
    const urlParams = new URLSearchParams(location.search)
    const token = urlParams.get('token')
    const userParam = urlParams.get('user')
    const error = urlParams.get('error')

    console.log("🔍 GoogleCallback - Processing:", { 
      token: token ? "exists" : "none", 
      user: userParam ? "exists" : "none",
      error, 
      isPopup: !!window.opener 
    })

    // Xử lý lỗi từ backend
    if (error) {
      console.error("❌ Google login error:", error)
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: error
        }, window.location.origin)
        setTimeout(() => window.close(), 500)
      } else {
        navigate('/login?error=' + encodeURIComponent(error), { replace: true })
      }
      return
    }

    // Xử lý thành công
    if (token && userParam) {
      try {
        // Parse user data từ URL
        const user = JSON.parse(decodeURIComponent(userParam))
        
        console.log("✅ Google login success:", { userId: user._id, email: user.email })

        if (window.opener) {
          // Nếu là popup, gửi data về parent window
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_SUCCESS',
            payload: { token, user }
          }, window.location.origin)
          
          // Đóng popup
          setTimeout(() => window.close(), 500)
        } else {
          // Nếu là direct navigation, lưu vào localStorage và redirect
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          
          console.log("💾 Saved to localStorage, redirecting to home...")
          
          // Redirect về trang chủ
          window.location.href = '/'
        }
      } catch (parseError) {
        console.error("❌ Failed to parse user data:", parseError)
        navigate('/login?error=Invalid user data', { replace: true })
      }
    } else {
      // Không có token hoặc user, redirect về login
      console.warn("⚠️ Missing token or user data")
      navigate('/login', { replace: true })
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