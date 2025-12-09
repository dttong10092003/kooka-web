import type React from "react"
import { useState } from "react"
import { Shield, Download, X, Eye, EyeOff } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

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

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handlePreferenceChange = (field: string, value: boolean | string) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validatePassword = () => {
    const errors: string[] = []

    if (!passwordData.oldPassword) {
      errors.push("Vui lòng nhập mật khẩu cũ")
    }

    if (!passwordData.newPassword) {
      errors.push("Vui lòng nhập mật khẩu mới")
    } else if (passwordData.newPassword.length < 6) {
      errors.push("Mật khẩu mới phải có ít nhất 6 ký tự")
    }

    if (!passwordData.confirmPassword) {
      errors.push("Vui lòng xác nhận mật khẩu mới")
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.push("Mật khẩu xác nhận không khớp")
    }

    setPasswordErrors(errors)
    return errors.length === 0
  }

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return
    }

    setIsSubmitting(true)
    setPasswordErrors([])
    setSuccessMessage("")

    try {
      await axiosInstance.post("/auth/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })

      setSuccessMessage("Đổi mật khẩu thành công!")
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setTimeout(() => {
        setShowChangePasswordModal(false)
        setSuccessMessage("")
      }, 2000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Đổi mật khẩu thất bại"
      if (errorMessage.includes("incorrect") || errorMessage.includes("sai")) {
        setPasswordErrors(["Mật khẩu cũ không đúng"])
      } else {
        setPasswordErrors([errorMessage])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetPasswordModal = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setPasswordErrors([])
    setSuccessMessage("")
    setShowPasswords({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    })
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


      {/* Account Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài Đặt Tài Khoản</h2>
        <div className="space-y-4">
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
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

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h3>
              <button
                onClick={() => {
                  setShowChangePasswordModal(false)
                  resetPasswordModal()
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}

            {passwordErrors.length > 0 && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <ul className="list-disc list-inside">
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu cũ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.oldPassword ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, oldPassword: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-12"
                    placeholder="Nhập mật khẩu cũ"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, oldPassword: !prev.oldPassword }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.oldPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-12"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, newPassword: !prev.newPassword }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.newPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-12"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowChangePasswordModal(false)
                  resetPasswordModal()
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
