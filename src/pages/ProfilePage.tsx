import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Calendar, MapPin, Edit, Save, X, Camera, CheckCircle } from "lucide-react"
import type { RootState, AppDispatch } from "../redux/store"
import { fetchProfile, updateProfile } from "../redux/slices/userSlice"
import { useRef } from "react"
import toast from "react-hot-toast"

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Lấy từ Redux
  const { user } = useSelector((state: RootState) => state.auth)
  const { profile, loading } = useSelector((state: RootState) => state.user)

  

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile || null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Lấy profile khi user login xong
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchProfile(user._id))
    }
  }, [user, dispatch])

  // Sync formData khi profile thay đổi
  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSave = () => {
    if (user?._id && formData) {
      dispatch(updateProfile({ userId: user._id, data: formData }))
    }
    setIsEditing(false)
    setAvatarPreview(null)
  }

  // Handle avatar file selection
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setAvatarPreview(base64)
      handleInputChange('avatar', base64)
    }
    reader.onerror = () => {
      toast.error('Failed to read file')
    }
    reader.readAsDataURL(file)
  }

  // Trigger file input
  const handleCameraClick = () => {
    if (isEditing) {
      fileInputRef.current?.click()
    }
  }

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  if (loading && !profile) {
    return <div className="p-8 text-center text-gray-600">Đang tải thông tin...</div>
  }

  if (!formData) {
    return <div className="p-8 text-center text-gray-600">Không có dữ liệu hồ sơ</div>
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-t-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            {/* Avatar with Camera Button */}
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden ring-4 ring-white/30 shadow-xl">
                {(avatarPreview || formData?.avatar) ? (
                  <img 
                    src={avatarPreview || formData?.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getUserInitials(`${formData.firstName} ${formData.lastName}`)}
                  </div>
                )}
              </div>
              
              {/* Camera Button - Only show when editing */}
              {isEditing && (
                <button 
                  type="button"
                  onClick={handleCameraClick}
                  className="absolute bottom-0 right-0 bg-white text-orange-600 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 shadow-lg hover:scale-110"
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-white/90 mb-3 text-lg">{user?.email}</p>
              <div className="flex items-center space-x-6 text-sm text-white/80">
                {formData.createdAt && (
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Tham gia {formData.createdAt.split("T")[0]}</span>
                  </div>
                )}
                {formData.location && (
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{formData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (isEditing) {
                setAvatarPreview(null)
                setFormData(profile)
              }
              setIsEditing(!isEditing)
            }}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:scale-105"
          >
            {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            <span className="font-semibold">{isEditing ? "Hủy" : "Chỉnh sửa"}</span>
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
            <span>Thông Tin Cá Nhân</span>
          </h2>
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:scale-105"
            >
              <Save className="h-5 w-5" />
              <span className="font-semibold">Lưu thay đổi</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Họ</label>
            <input
              type="text"
              value={formData.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                !isEditing 
                  ? "bg-gray-50 text-gray-600 border-gray-200" 
                  : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 hover:border-orange-400"
              }`}
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên</label>
            <input
              type="text"
              value={formData.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                !isEditing 
                  ? "bg-gray-50 text-gray-600 border-gray-200" 
                  : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 hover:border-orange-400"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle className="h-5 w-5 text-green-500" aria-label="Email đã xác thực" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày tham gia</label>
            <input
              type="text"
              value={formData.createdAt ? new Date(formData.createdAt).toLocaleDateString('vi-VN') : ""}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cập nhật gần nhất</label>
            <input
              type="text"
              value={formData.updatedAt ? new Date(formData.updatedAt).toLocaleDateString('vi-VN') : ""}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
