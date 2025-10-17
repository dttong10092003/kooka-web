import type React from "react"
import { useState } from "react"
import { Shield, Download, X } from "lucide-react"

const Settings: React.FC = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    recipeRecommendations: true,
    weeklyNewsletter: false,
    privacy: "public",
    showEmail: "private",
    allowMessages: "friends",
  })

  const handlePreferenceChange = (field: string, value: boolean | string) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài Đặt Thông Báo</h2>
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Thông báo Email</h3>
              <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Thông báo Đẩy</h3>
              <p className="text-sm text-gray-600">Nhận thông báo đẩy</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) => handlePreferenceChange("pushNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Recipe Recommendations */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Khuyến nghị công thức</h3>
              <p className="text-sm text-gray-600">Nhận gợi ý công thức phù hợp</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.recipeRecommendations}
                onChange={(e) => handlePreferenceChange("recipeRecommendations", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Weekly Newsletter */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Bản tin hàng tuần</h3>
              <p className="text-sm text-gray-600">Nhận bản tin công thức mới</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.weeklyNewsletter}
                onChange={(e) => handlePreferenceChange("weeklyNewsletter", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài Đặt Riêng Tư</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quyền riêng tư hồ sơ</label>
            <select
              value={preferences.privacy}
              onChange={(e) => handlePreferenceChange("privacy", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
            >
              <option value="public">Công khai</option>
              <option value="private">Riêng tư</option>
              <option value="friends">Bạn bè</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hiển thị email</label>
            <select
              value={preferences.showEmail}
              onChange={(e) => handlePreferenceChange("showEmail", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
            >
              <option value="public">Công khai</option>
              <option value="private">Riêng tư</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cho phép tin nhắn</label>
            <select
              value={preferences.allowMessages}
              onChange={(e) => handlePreferenceChange("allowMessages", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
            >
              <option value="everyone">Mọi người</option>
              <option value="friends">Bạn bè</option>
              <option value="none">Không ai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài Đặt Tài Khoản</h2>
        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Đổi mật khẩu</h3>
                <p className="text-sm text-gray-600">Cập nhật mật khẩu của bạn</p>
              </div>
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
          </button>

          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Xác thực 2 bước</h3>
                <p className="text-sm text-gray-600">Tăng cường bảo mật tài khoản</p>
              </div>
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
          </button>

          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Tải xuống dữ liệu</h3>
                <p className="text-sm text-gray-600">Tải xuống bản sao dữ liệu của bạn</p>
              </div>
              <Download className="h-5 w-5 text-gray-400" />
            </div>
          </button>

          <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Xóa tài khoản</h3>
                <p className="text-sm text-red-500">Xóa vĩnh viễn tài khoản của bạn</p>
              </div>
              <X className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
