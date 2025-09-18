import type React from "react"
import { useState } from "react"
import { Calendar, MapPin, Edit, Save, X, Camera } from "lucide-react"

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: "Nguyen",
    lastName: "An",
    email: "an.nguyen@example.com",
    phone: "+84 123 456 789",
    location: "Ho Chi Minh City, Vietnam",
    bio: "Passionate home cook who loves experimenting with new recipes.",
    joinDate: "2024-01-15",
    birthDate: "1990-05-15",
    website: "https://mycookingblog.com",
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-t-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getUserInitials("Nguyen An")}
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-1">Nguyen Van An</h1>
              <p className="text-white/90 mb-2">an.nguyen@example.com</p>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {profileData.joinDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
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
              value={profileData.firstName}
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
              value={profileData.lastName}
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
              value={profileData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${
                !isEditing ? "bg-gray-50 text-gray-600" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={profileData.phone}
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
            value={profileData.bio}
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
