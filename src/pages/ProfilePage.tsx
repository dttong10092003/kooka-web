import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Calendar, MapPin, Edit, Save, X, Camera } from "lucide-react"
import type { RootState, AppDispatch } from "../redux/store"
import { fetchProfile, updateProfile } from "../redux/slices/userSlice"

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Lấy từ Redux
  const { user } = useSelector((state: RootState) => state.auth)
  const { profile, loading } = useSelector((state: RootState) => state.user)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile || null)

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
  }

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  if (loading && !profile) {
    return <div className="p-8">Loading profile...</div>
  }

  if (!formData) {
    return <div className="p-8">No profile data available</div>
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-t-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getUserInitials(`${formData.firstName} ${formData.lastName}`)}
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-1">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-white/90 mb-2">{user?.email}</p>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                {formData.createdAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formData.createdAt.split("T")[0]}</span>
                  </div>
                )}
                {formData.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{formData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${
                !isEditing ? "bg-gray-50 text-gray-600" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${
                !isEditing ? "bg-gray-50 text-gray-600" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${
                !isEditing ? "bg-gray-50 text-gray-600" : ""
              }`}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={formData.bio || ""}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
            rows={4}
            className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${
              !isEditing ? "bg-gray-50 text-gray-600" : ""
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
