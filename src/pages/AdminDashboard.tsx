import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { AppDispatch, RootState } from "../redux/store"
import { fetchRecipes, deleteRecipe } from "../redux/slices/recipeSlice"
import type { Recipe } from "../redux/slices/recipeSlice"
import {
    BarChart3,
    Users,
    ChefHat,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    Search,
    Download,
    Settings,
    Bell,
    Star,
    Eye,
    MessageSquare,
    LogOut,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AddRecipeModal from "../components/AddRecipeModal";
import EditRecipeModal from "../components/EditRecipeModal";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("overview")
    const [searchQuery, setSearchQuery] = useState("")
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)
    const [recentUsers, setRecentUsers] = useState<any[]>([])
    const [weeklyData, setWeeklyData] = useState<any[]>([])
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [dashboardStats, setDashboardStats] = useState({
        totalRecipes: 0,
        activeUsers: 0,
        recipeViews: 0,
        userReviews: 0,
    })
    const [loadingStats, setLoadingStats] = useState(true)
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { recipes, loading, error } = useSelector((state: RootState) => state.recipes)

    useEffect(() => {
        dispatch(fetchRecipes())
        fetchDashboardStats()
        fetchRecentUsers()
        fetchWeeklyUserActivity(selectedYear, selectedMonth)
    }, [dispatch])

    useEffect(() => {
        fetchWeeklyUserActivity(selectedYear, selectedMonth)
    }, [selectedYear, selectedMonth])

    const fetchDashboardStats = async () => {
        try {
            setLoadingStats(true)
            const [recipesRes, usersRes, reviewsRes] = await Promise.all([
                axiosInstance.get("/recipes"),
                axiosInstance.get("/user/profile/count"),
                axiosInstance.get("/reviews/count"),
            ])

            // Tính tổng views từ tất cả recipes (nếu có field views)
            const totalViews = recipesRes.data.reduce((sum: number, recipe: any) =>
                sum + (recipe.views || 0), 0
            )

            setDashboardStats({
                totalRecipes: recipesRes.data.length || 0,
                activeUsers: usersRes.data.count || 0,
                recipeViews: totalViews,
                userReviews: reviewsRes.data.count || 0,
            })
        } catch (error) {
            console.error("Error fetching dashboard stats:", error)
            // Fallback: use recipes length from Redux
            setDashboardStats({
                totalRecipes: recipes.length,
                activeUsers: 0,
                recipeViews: 0,
                userReviews: 0,
            })
        } finally {
            setLoadingStats(false)
        }
    }

    const fetchRecentUsers = async () => {
        try {
            const res = await axiosInstance.get("/user/profile/recent?limit=5")
            setRecentUsers(res.data || [])
        } catch (error) {
            console.error("Error fetching recent users:", error)
            setRecentUsers([])
        }
    }

    const fetchWeeklyUserActivity = async (year: number, month: number) => {
        try {
            const res = await axiosInstance.get(`/user/profile/stats/weekly`, {
                params: { year, month }
            })

            console.log("API Response:", res.data)

            // API trả về object với field weeks
            const weeklyStats = res.data?.weeks || []

            const formattedWeekly = weeklyStats.map((week: any) => ({
                week: week.week, // "Week 1", "Week 2", ...
                users: week.users || 0,
                period: week.period // "Day 1-7", ...
            }))

            console.log(`Weekly stats for ${year}-${month}:`, formattedWeekly)
            setWeeklyData(formattedWeekly)
        } catch (error) {
            console.error("Error fetching weekly user activity:", error)
            setWeeklyData([])
        }
    }

    const handlePreviousMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12)
            setSelectedYear(selectedYear - 1)
        } else {
            setSelectedMonth(selectedMonth - 1)
        }
    }

    const handleNextMonth = () => {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth() + 1

        // Không cho phép chọn tháng trong tương lai
        if (selectedYear === currentYear && selectedMonth === currentMonth) {
            return
        }

        if (selectedMonth === 12) {
            setSelectedMonth(1)
            setSelectedYear(selectedYear + 1)
        } else {
            setSelectedMonth(selectedMonth + 1)
        }
    }

    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return num.toString()
    }

    const currentUser = {
        name: "Admin User",
        email: "admin@supercook.com",
        avatar: "AU",
        role: "Administrator",
    }

    // Mock data
    const stats = [
        {
            title: "Total Recipes",
            value: loadingStats ? "..." : formatNumber(dashboardStats.totalRecipes),
            change: "+12%",
            trend: "up",
            icon: ChefHat,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Active Users",
            value: loadingStats ? "..." : formatNumber(dashboardStats.activeUsers),
            change: "+8%",
            trend: "up",
            icon: Users,
            color: "from-green-500 to-green-600",
        },
        {
            title: "Recipe Views",
            value: loadingStats ? "..." : formatNumber(dashboardStats.recipeViews),
            change: "+23%",
            trend: "up",
            icon: Eye,
            color: "from-purple-500 to-purple-600",
        },
        {
            title: "User Reviews",
            value: loadingStats ? "..." : formatNumber(dashboardStats.userReviews),
            change: "+15%",
            trend: "up",
            icon: MessageSquare,
            color: "from-orange-500 to-orange-600",
        },
    ]

    const recentRecipes = [
        {
            id: 1,
            title: "Spicy Thai Basil Chicken",
            author: "Chef Maria",
            status: "Published",
            views: "2.3K",
            rating: 4.8,
            date: "2025-01-15",
        },
        {
            id: 2,
            title: "Classic French Onion Soup",
            author: "Chef Pierre",
            status: "Draft",
            views: "1.8K",
            rating: 4.6,
            date: "2025-01-14",
        },
        {
            id: 3,
            title: "Vegan Buddha Bowl",
            author: "Chef Sarah",
            status: "Published",
            views: "3.1K",
            rating: 4.9,
            date: "2025-01-13",
        },
        {
            id: 4,
            title: "Chocolate Lava Cake",
            author: "Chef David",
            status: "Review",
            views: "4.2K",
            rating: 4.7,
            date: "2025-01-12",
        },
    ]

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "recipes", label: "Recipes", icon: ChefHat },
        { id: "users", label: "Users", icon: Users },
        { id: "analytics", label: "Analytics", icon: TrendingUp },
        { id: "settings", label: "Settings", icon: Settings },
    ]

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "published":
                return "bg-green-100 text-green-800"
            case "draft":
                return "bg-yellow-100 text-yellow-800"
            case "review":
                return "bg-blue-100 text-blue-800"
            case "active":
                return "bg-green-100 text-green-800"
            case "inactive":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleDeleteClick = (recipe: Recipe) => {
        setRecipeToDelete(recipe)
        setDeleteConfirmOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (recipeToDelete) {
            try {
                await dispatch(deleteRecipe(recipeToDelete._id))
                setDeleteConfirmOpen(false)
                setRecipeToDelete(null)
                toast.success("Xóa công thức thành công!", { duration: 2500 })
            } catch (error) {
                console.error("Failed to delete recipe:", error)
                toast.error("Xóa công thức thất bại. Vui lòng thử lại.", { duration: 2500 })
            }
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false)
        setRecipeToDelete(null)
    }

    const handleEditClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe)
        setIsEditModalOpen(true)
    }

    const handleEditModalClose = () => {
        setIsEditModalOpen(false)
        setSelectedRecipe(null)
    }

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full overflow-y-auto">
                {/* Back Button */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors duration-200 w-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-lg font-semibold">Back</span>
                    </button>
                </div>

                {/* User Profile Section */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-lg">{currentUser.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{currentUser.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{currentUser.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${activeTab === tab.id
                                    ? "bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <IconComponent className="h-5 w-5" />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        )
                    })}

                    {/* thêm logout trực tiếp */}
                    <button
                        onClick={() => setLogoutConfirmOpen(true)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all duration-200 cursor-pointer"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </nav>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
                    <div className="px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {tabs.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                    <Bell className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={() => setIsRecipeModalOpen(true)}
                                    className="bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
                                    <Plus className="h-4 w-4" />
                                    <span>Add Recipe</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 px-6 lg:px-8 py-8 overflow-y-auto">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => {
                                    const IconComponent = stat.icon
                                    return (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                                    <div className="flex items-center mt-2">
                                                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                                        <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                                                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                                                    </div>
                                                </div>
                                                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                                                    <IconComponent className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Recipe Performance Chart */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Recipe Performance</h3>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Download className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart3 className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                                            <p className="text-gray-600">Chart visualization would go here</p>
                                        </div>
                                    </div>
                                </div>

                                {/* User Activity Chart - Weekly */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            User Activity
                                        </h3>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Download className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Month/Year Selector */}
                                    <div className="flex items-center justify-between mb-6">
                                        <button
                                            onClick={handlePreviousMonth}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                                        </button>
                                        <div className="text-center">
                                            <h4 className="text-base font-semibold text-gray-900">
                                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][selectedMonth - 1]} {selectedYear}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">Weekly new users registration</p>
                                        </div>
                                        <button
                                            onClick={handleNextMonth}
                                            disabled={selectedYear === new Date().getFullYear() && selectedMonth === new Date().getMonth() + 1}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="h-5 w-5 text-gray-600" />
                                        </button>
                                    </div>

                                    {weeklyData.length > 0 ? (
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={weeklyData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                    <XAxis
                                                        dataKey="week"
                                                        stroke="#9ca3af"
                                                        style={{ fontSize: '12px' }}
                                                    />
                                                    <YAxis
                                                        stroke="#9ca3af"
                                                        style={{ fontSize: '12px' }}
                                                        allowDecimals={false}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: '#fff',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                        }}
                                                        labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                                                        cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="users"
                                                        stroke="#f97316"
                                                        strokeWidth={3}
                                                        dot={{ fill: '#f97316', strokeWidth: 2, r: 5 }}
                                                        activeDot={{ r: 7 }}
                                                        name="New Users"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center">
                                            <div className="text-center">
                                                <Users className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                                                <p className="text-gray-600">No user activity data available</p>
                                                <p className="text-sm text-gray-500 mt-1">for {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][selectedMonth - 1]} {selectedYear}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Recent Recipes */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Recent Recipes</h3>
                                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">View All</button>
                                    </div>
                                    <div className="space-y-4">
                                        {recentRecipes.map((recipe) => (
                                            <div
                                                key={recipe.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{recipe.title}</h4>
                                                    <p className="text-sm text-gray-600">by {recipe.author}</p>
                                                    <div className="flex items-center space-x-4 mt-2">
                                                        <span className="flex items-center text-sm text-gray-500">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            {recipe.views}
                                                        </span>
                                                        <span className="flex items-center text-sm text-gray-500">
                                                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                                            {recipe.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recipe.status)}`}
                                                    >
                                                        {recipe.status}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">{recipe.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Users */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">View All</button>
                                    </div>
                                    <div className="space-y-4">
                                        {recentUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-medium text-sm">
                                                            {user.name
                                                                ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
                                                                : "U"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            {user.name || "Unknown User"}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">{user.email || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor("Active")}`}>
                                                        Active
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "recipes" && (
                        <div className="space-y-6">
                            {/* Search & Add */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search recipes..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setIsRecipeModalOpen(true)}
                                            className="bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
                                        >
                                            <Plus className="h-5 w-5" />
                                            <span>Add Recipe</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recipes Table */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {loading ? (
                                    <div className="p-6 text-center text-gray-500">Loading recipes...</div>
                                ) : error ? (
                                    <div className="p-6 text-center text-red-500">Error: {error}</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Cuisine</th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {recipes.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="text-center py-6 text-gray-500">
                                                            No recipes found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    recipes
                                                        .filter((r) =>
                                                            r.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                        )
                                                        .map((recipe: Recipe) => (
                                                            <tr key={recipe._id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-6 py-4 font-medium text-gray-900">{recipe.name}</td>
                                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                                    {recipe.cuisine?.name || "—"}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                                    {recipe.difficulty || "Normal"}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                                        <span className="text-sm text-gray-600">{(recipe.rate || 0).toFixed(1)}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => handleEditClick(recipe)}
                                                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteClick(recipe)}
                                                                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                    {/* Users Tab */}
                    {activeTab === "users" && (
                        <div className="space-y-6">
                            {/* User Management Header */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                                        <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            Export Users
                                        </button>
                                        <button className="bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                                            Add User
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Join Date
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Recipes
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentUsers.map((user, index) => (
                                                <tr key={user._id || index} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                                                                <span className="text-white font-medium text-sm">
                                                                    {user.name
                                                                        ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
                                                                        : "U"}
                                                                </span>
                                                            </div>
                                                            <div className="font-medium text-gray-900">
                                                                {user.name || "Unknown User"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email || "N/A"}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">-</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor("Active")}`}
                                                        >
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === "analytics" && (
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart3 className="h-20 w-20 text-blue-400 mx-auto mb-4" />
                                            <p className="text-gray-600 text-lg">Advanced Analytics Charts</p>
                                            <p className="text-gray-500 text-sm">Coming Soon</p>
                                        </div>
                                    </div>
                                    <div className="h-80 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <TrendingUp className="h-20 w-20 text-green-400 mx-auto mb-4" />
                                            <p className="text-gray-600 text-lg">Performance Metrics</p>
                                            <p className="text-gray-500 text-sm">Coming Soon</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                                                    <input
                                                        type="text"
                                                        defaultValue="Kooka"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                                                    <textarea
                                                        defaultValue="Find recipes with ingredients you already have"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Email Notifications</span>
                                                    <input type="checkbox" defaultChecked className="rounded" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Push Notifications</span>
                                                    <input type="checkbox" defaultChecked className="rounded" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">SMS Notifications</span>
                                                    <input type="checkbox" className="rounded" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirmOpen && (
                    <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Xác nhận xóa công thức
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                Bạn có chắc chắn muốn xóa công thức "{recipeToDelete?.name}"?
                                Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleDeleteCancel}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Logout Confirmation Modal */}
                {logoutConfirmOpen && (
                    <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
                                <LogOut className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Xác nhận đăng xuất
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản admin?
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setLogoutConfirmOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => {
                                        setLogoutConfirmOpen(false)
                                        // Implement logout logic here
                                        navigate("/login")
                                    }}
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Recipe Modal */}
                <AddRecipeModal
                    isOpen={isRecipeModalOpen}
                    onClose={() => setIsRecipeModalOpen(false)}
                />

                {/* Edit Recipe Modal */}
                <EditRecipeModal
                    isOpen={isEditModalOpen}
                    onClose={handleEditModalClose}
                    recipe={selectedRecipe}
                />
            </div>
        </div>
    )
}

export default AdminDashboard
