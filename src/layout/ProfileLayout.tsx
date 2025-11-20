import type React from "react"
import { ArrowLeft, User, Heart, Star, Settings as SettingsIcon } from "lucide-react"
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"

const ProfileLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state: RootState) => state.auth)
  const { profile } = useSelector((state: RootState) => state.user)
  

  
  // Prefer auth user avatar first, then profile avatar
  let displayAvatar = user?.avatar || profile?.avatar
  
  // Fix Google avatar URL format
  if (displayAvatar && displayAvatar.includes('googleusercontent.com')) {
    // Ensure Google avatar has proper size parameter
    if (!displayAvatar.includes('=s')) {
      displayAvatar = displayAvatar + '=s200-c';
    }
  }
  
  const displayName = profile ? 
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || user?.username || "Khách" :
    user?.username || "Khách"
    

  const sidebarItems = [
    { id: "profile", label: "Hồ Sơ", icon: User, path: "/my-profile" },
    { id: "favorites", label: "Yêu Thích", icon: Heart, path: "/my-favorites" },
    { id: "reviews", label: "Đánh Giá", icon: Star, path: "/my-reviews" },
    { id: "settings", label: "Cài Đặt", icon: SettingsIcon, path: "/my-settings" },
  ]

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const name = `${firstName || ""} ${lastName || ""}`.trim()
    if (!name) return "U" // User default
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:translate-x-[-4px]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>

        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-white to-orange-50">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 relative">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.log("❌ Avatar failed to load:", displayAvatar);
                    e.currentTarget.style.display = 'none';
                    const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallbackDiv) {
                      fallbackDiv.style.display = 'flex';
                    }
                  }}
               
                />
              ) : null}
              <div 
                className={`w-full h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  displayAvatar ? 'hidden' : 'flex'
                }`}
                style={{ display: displayAvatar ? 'none' : 'flex' }}
              >
                {getUserInitials(profile?.firstName, profile?.lastName)}
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900 text-sm">
                {displayName}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer ${
                      isActive
                        ? "bg-orange-50 text-orange-600 border border-orange-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent
                      className={`h-5 w-5 ${isActive ? "text-orange-600" : ""}`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet /> {/* render nội dung con */}
        </div>
      </div>
    </div>
  )
}

export default ProfileLayout
