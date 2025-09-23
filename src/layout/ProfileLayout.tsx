import type React from "react"
import { ArrowLeft, User, Heart, Star, Settings as SettingsIcon } from "lucide-react"
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"

const ProfileLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useSelector((state: RootState) => state.user)

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User, path: "/my-profile" },
    { id: "favorites", label: "Favorites", icon: Heart, path: "/my-favorites" },
    { id: "reviews", label: "My Reviews", icon: Star, path: "/my-reviews" },
    { id: "settings", label: "Settings", icon: SettingsIcon, path: "/my-settings" },
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {getUserInitials(profile?.firstName, profile?.lastName)}
              </div>
            )}

            <div>
              <p className="font-medium text-gray-900 text-sm">
                {profile
                  ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
                  : "Guest User"}
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
