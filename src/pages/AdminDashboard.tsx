import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { AppDispatch, RootState } from "../redux/store"
import { fetchRecipes, deleteRecipe, fetchNewestRecipes, getRecipeById } from "../redux/slices/recipeSlice"
import { logout } from "../redux/slices/authSlice"
import { clearProfile } from "../redux/slices/userSlice"
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
    ChevronLeft,
    ChevronRight,
    Database,
    UserPlus,
    X,
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AddRecipeModal from "../components/AddRecipeModal";
import EditRecipeModal from "../components/EditRecipeModal";
import DataManagement from "./DataManagement";
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
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
    const [adminFormData, setAdminFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [adminFormLoading, setAdminFormLoading] = useState(false)
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
    const [recipePerformanceData, setRecipePerformanceData] = useState<any[]>([])
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { recipes, loading, error, newestRecipes } = useSelector((state: RootState) => state.recipes)

    // Load initial data - only fetch if not already loaded from App
    useEffect(() => {
        if (recipes.length === 0) {
            dispatch(fetchRecipes())
        }
        dispatch(fetchNewestRecipes(4))
    }, [dispatch, recipes.length])

    // Load dashboard data
    useEffect(() => {
        fetchDashboardStats()
        fetchRecentUsers()
        fetchWeeklyUserActivity(selectedYear, selectedMonth)
        fetchRecipePerformance()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear, selectedMonth])

    const fetchDashboardStats = async () => {
        try {
            setLoadingStats(true)
            
            // Get current month and year
            const currentDate = new Date()
            const currentYear = currentDate.getFullYear()
            const currentMonth = currentDate.getMonth() + 1

            const [recipesRes, usersRes, reviewsRes, monthlyViewsRes] = await Promise.all([
                axiosInstance.get("/recipes"),
                axiosInstance.get("/user/profile/count"),
                axiosInstance.get("/reviews/count"),
                axiosInstance.get(`/views/monthly/total?year=${currentYear}&month=${currentMonth}`),
            ])

            setDashboardStats({
                totalRecipes: recipesRes.data.length || 0,
                activeUsers: usersRes.data.count || 0,
                recipeViews: monthlyViewsRes.data.totalViews || 0,
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


            // API trả về object với field weeks
            const weeklyStats = res.data?.weeks || []

            const formattedWeekly = weeklyStats.map((week: any) => ({
                week: week.week, 
                users: week.users || 0,
                period: week.period 
            }))

            setWeeklyData(formattedWeekly)
        } catch (error) {
            console.error("Error fetching weekly user activity:", error)
            setWeeklyData([])
        }
    }

    const fetchRecipePerformance = async () => {
        try {
            // Fetch recipes and views data
            const recipesRes = await axiosInstance.get("/recipes")
            const recipes = recipesRes.data
            
            // Get view counts for top 10 recipes
            const recipeIds = recipes.map((r: any) => r._id).slice(0, 10)
            const viewsRes = await axiosInstance.post("/views/batch", { recipeIds })
            const viewsData = viewsRes.data || {}

            // Combine data for top 10 recipes
            const performanceData = recipes.slice(0, 10).map((recipe: any) => {
                const recipeViews = viewsData[recipe._id] || 0
                return {
                    name: recipe.name.length > 15 ? recipe.name.substring(0, 15) + "..." : recipe.name,
                    views: recipeViews,
                    reviews: recipe.numberOfRate || 0,
                    favorites: Math.floor(recipeViews * 0.3) 
                }
            })

            setRecipePerformanceData(performanceData)
        } catch (error) {
            console.error("Error fetching recipe performance:", error)
            setRecipePerformanceData([])
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
        name: "Người quản trị",
        email: "admin@supercook.com",
        avatar: "AU",
        role: "Quản trị viên",
    }

    // Mock data
    const stats = [
        {
            title: "Tổng số công thức",
            value: loadingStats ? "..." : formatNumber(dashboardStats.totalRecipes),
            change: "+12%",
            trend: "up",
            icon: ChefHat,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Người dùng hoạt động",
            value: loadingStats ? "..." : formatNumber(dashboardStats.activeUsers),
            change: "+8%",
            trend: "up",
            icon: Users,
            color: "from-green-500 to-green-600",
        },
        {
            title: "Lượt xem hàng tháng",
            value: loadingStats ? "..." : formatNumber(dashboardStats.recipeViews),
            change: "+23%",
            trend: "up",
            icon: Eye,
            color: "from-purple-500 to-purple-600",
        },
        {
            title: "Đánh giá của người dùng",
            value: loadingStats ? "..." : formatNumber(dashboardStats.userReviews),
            change: "+15%",
            trend: "up",
            icon: MessageSquare,
            color: "from-orange-500 to-orange-600",
        },
    ]

    // Get 4 most recent recipes from Redux store
    const recentRecipes = newestRecipes

    const tabs = [
        { id: "overview", label: "Tổng quan", icon: BarChart3 },
        { id: "recipes", label: "Công thức", icon: ChefHat },
        { id: "users", label: "Người dùng", icon: Users },
        { id: "data", label: "Quản lý dữ liệu", icon: Database },
        { id: "analytics", label: "Phân tích", icon: TrendingUp },
        { id: "settings", label: "Cài đặt", icon: Settings },
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

    const handleEditClick = async (recipe: Recipe) => {
        // Fetch full recipe data including instructions before opening modal
        try {
            const result = await dispatch(getRecipeById(recipe._id)).unwrap()
            setSelectedRecipe(result)
            setIsEditModalOpen(true)
        } catch (error) {
            console.error("Failed to fetch recipe details:", error)
            toast.error("Không thể tải chi tiết công thức. Vui lòng thử lại.", { duration: 2500 })
        }
    }

    const handleEditModalClose = () => {
        setIsEditModalOpen(false)
        setSelectedRecipe(null)
    }

    const handleAddModalClose = () => {
        setIsRecipeModalOpen(false)
    }

    // Pagination logic
    const filteredRecipes = recipes.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentRecipes = filteredRecipes.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setCurrentPage(1) 
    }

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full overflow-y-auto">
           
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
                        <span className="font-medium">Đăng xuất</span>
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
                                    {recipePerformanceData.length > 0 ? (
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={recipePerformanceData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                    <XAxis 
                                                        dataKey="name" 
                                                        stroke="#9ca3af"
                                                        style={{ fontSize: '11px' }}
                                                        angle={-15}
                                                        textAnchor="end"
                                                        height={60}
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
                                                        cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                                                    />
                                                    <Legend 
                                                        wrapperStyle={{ fontSize: '12px' }}
                                                        iconType="circle"
                                                    />
                                                    <Bar 
                                                        dataKey="views" 
                                                        fill="#8b5cf6" 
                                                        name="Lượt xem"
                                                        radius={[8, 8, 0, 0]}
                                                    />
                                                    <Bar 
                                                        dataKey="reviews" 
                                                        fill="#f97316" 
                                                        name="Đánh giá"
                                                        radius={[8, 8, 0, 0]}
                                                    />
                                                    <Bar 
                                                        dataKey="favorites" 
                                                        fill="#ef4444" 
                                                        name="Yêu thích"
                                                        radius={[8, 8, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center">
                                            <div className="text-center">
                                                <BarChart3 className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                                                <p className="text-gray-600">Không có dữ liệu hiệu suất công thức</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* User Activity Chart - Weekly */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Hoạt động người dùng
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
                                                {['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'][selectedMonth - 1]}, {selectedYear}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">Đăng ký người dùng mới theo tuần</p>
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
                                                        name="Người dùng mới"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center">
                                            <div className="text-center">
                                                <Users className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                                                <p className="text-gray-600">Không có dữ liệu hoạt động người dùng</p>
                                                <p className="text-sm text-gray-500 mt-1">cho {['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'][selectedMonth - 1]}, {selectedYear}</p>
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
                                        <h3 className="text-lg font-semibold text-gray-900">Công thức gần đây</h3>
                                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">Xem tất cả</button>
                                    </div>
                                    <div className="space-y-4">
                                        {recentRecipes.length > 0 ? (
                                            recentRecipes.map((recipe) => (
                                                <div
                                                    key={recipe._id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{recipe.name}</h4>
                                                        <p className="text-sm text-gray-600">{recipe.cuisine?.name || "Various Cuisine"}</p>
                                                        <div className="flex items-center space-x-4 mt-2">
                                                            <span className="flex items-center text-sm text-gray-500">
                                                                <ChefHat className="h-4 w-4 mr-1" />
                                                                {recipe.difficulty || "Normal"}
                                                            </span>
                                                            <span className="flex items-center text-sm text-gray-500">
                                                                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                                                {recipe.rate?.toFixed(1) || "0.0"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Published
                                                        </span>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {recipe.createdAt 
                                                                ? new Date(recipe.createdAt).toLocaleDateString('vi-VN')
                                                                : "N/A"
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                Không có công thức gần đây
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Users */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Người dùng gần đây</h3>
                                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">Xem tất cả</button>
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
                                                        Hoạt động
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
                                            placeholder="Tìm kiếm công thức..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setIsRecipeModalOpen(true)}
                                            className="bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
                                        >
                                            <Plus className="h-5 w-5" />
                                            <span>Thêm công thức</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recipes Table */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {loading ? (
                                    <div className="p-6 text-center text-gray-500">Đang tải công thức...</div>
                                ) : error ? (
                                    <div className="p-6 text-center text-red-500">Lỗi: {error}</div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ẩm thực</th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Mức độ khó</th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {currentRecipes.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="text-center py-6 text-gray-500">
                                                                {searchQuery ? "Không tìm thấy công thức phù hợp" : "Không có công thức"}
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        currentRecipes.map((recipe: Recipe) => (
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

                                        {/* Pagination Controls */}
                                        {filteredRecipes.length > 0 && (
                                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    {/* Items per page selector */}
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-700">Hiển thị</span>
                                                        <select
                                                            value={itemsPerPage}
                                                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                                                        >
                                                            <option value={5}>5</option>
                                                            <option value={10}>10</option>
                                                            <option value={15}>15</option>
                                                            <option value={20}>20</option>
                                                            <option value={50}>50</option>
                                                        </select>
                                                        <span className="text-sm text-gray-700">
                                                            trong số {filteredRecipes.length} công thức
                                                        </span>
                                                    </div>

                                                    {/* Page navigation */}
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                                        >
                                                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                                                        </button>

                                                        <div className="flex items-center space-x-1">
                                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                                let pageNum: number;
                                                                if (totalPages <= 5) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage <= 3) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage >= totalPages - 2) {
                                                                    pageNum = totalPages - 4 + i;
                                                                } else {
                                                                    pageNum = currentPage - 2 + i;
                                                                }

                                                                return (
                                                                    <button
                                                                        key={pageNum}
                                                                        onClick={() => handlePageChange(pageNum)}
                                                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                                                            currentPage === pageNum
                                                                                ? "bg-orange-500 text-white"
                                                                                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                                                                        }`}
                                                                    >
                                                                        {pageNum}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>

                                                        <button
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                                        >
                                                            <ChevronRight className="h-5 w-5 text-gray-600" />
                                                        </button>
                                                    </div>

                                                    {/* Page info */}
                                                    <div className="text-sm text-gray-700">
                                                        Trang {currentPage} / {totalPages}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
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
                                        <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
                                        <p className="text-gray-600 mt-1">Quản lý và theo dõi tài khoản người dùng</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            Xuất dữ liệu
                                        </button>
                                        <button 
                                            onClick={() => setIsAddAdminModalOpen(true)}
                                            className="bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            <span>Thêm tài khoản admin phụ</span>
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
                                                    Người dùng
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ngày tham gia
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Công thức
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Trạng thái
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hành động
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảng điều khiển phân tích</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart3 className="h-20 w-20 text-blue-400 mx-auto mb-4" />
                                            <p className="text-gray-600 text-lg">Biểu đồ phân tích nâng cao</p>
                                            <p className="text-gray-500 text-sm">Sắp ra mắt</p>
                                        </div>
                                    </div>
                                    <div className="h-80 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <TrendingUp className="h-20 w-20 text-green-400 mx-auto mb-4" />
                                            <p className="text-gray-600 text-lg">Chỉ số hiệu suất</p>
                                            <p className="text-gray-500 text-sm">Sắp ra mắt</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Management Tab */}
                    {activeTab === "data" && (
                        <DataManagement />
                    )}

                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt hệ thống</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt chung</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên trang web</label>
                                                    <input
                                                        type="text"
                                                        defaultValue="Kooka"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả trang web</label>
                                                    <textarea
                                                        defaultValue="Tìm công thức với nguyên liệu bạn đã có"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt thông báo</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Thông báo Email</span>
                                                    <input type="checkbox" defaultChecked className="rounded" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Thông báo đẩy</span>
                                                    <input type="checkbox" defaultChecked className="rounded" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">Thông báo SMS</span>
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
                                        // Xóa token và về trang Home
                                        dispatch(logout())
                                        dispatch(clearProfile())
                                        toast.success("Đăng xuất thành công!", { duration: 2500 })
                                        navigate("/")
                                    }}
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Admin Modal */}
                {isAddAdminModalOpen && (
                    <div className="fixed inset-0 bg-gray-800/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                        <UserPlus className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Thêm tài khoản admin phụ</h3>
                                        <p className="text-xs text-gray-500">Tạo tài khoản quản trị viên mới</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsAddAdminModalOpen(false)
                                        setAdminFormData({
                                            firstName: "",
                                            lastName: "",
                                            email: "",
                                            password: "",
                                            confirmPassword: "",
                                        })
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault()
                                    setAdminFormLoading(true)

                                    // Validation
                                    if (adminFormData.password !== adminFormData.confirmPassword) {
                                        toast.error("Mật khẩu xác nhận không khớp!", { duration: 2500 })
                                        setAdminFormLoading(false)
                                        return
                                    }

                                    if (adminFormData.password.length < 6) {
                                        toast.error("Mật khẩu phải có ít nhất 6 ký tự!", { duration: 2500 })
                                        setAdminFormLoading(false)
                                        return
                                    }

                                    try {
                                        // Gọi API tạo admin phụ
                                        const response = await axiosInstance.post("/auth/create-admin", {
                                            firstName: adminFormData.firstName,
                                            lastName: adminFormData.lastName,
                                            email: adminFormData.email,
                                            password: adminFormData.password,
                                        })
                                        
                                        toast.success(response.data.message || "Tạo tài khoản admin phụ thành công!", { duration: 2500 })
                                        setIsAddAdminModalOpen(false)
                                        setAdminFormData({
                                            firstName: "",
                                            lastName: "",
                                            email: "",
                                            password: "",
                                            confirmPassword: "",
                                        })
                                        // Refresh user list
                                        fetchRecentUsers()
                                    } catch (error: any) {
                                        console.error("Error creating admin:", error)
                                        const errorMsg = error.response?.data?.message || "Tạo tài khoản thất bại!"
                                        toast.error(errorMsg, { duration: 2500 })
                                    } finally {
                                        setAdminFormLoading(false)
                                    }
                                }}
                                className="p-6 space-y-4"
                            >
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={adminFormData.firstName}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="Nguyễn Văn"
                                        required
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={adminFormData.lastName}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="An"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={adminFormData.email}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                                        className="w-full px-3 py-2 border  rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="admin@kooka.com"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={adminFormData.password}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={adminFormData.confirmPassword}
                                        onChange={(e) => setAdminFormData({ ...adminFormData, confirmPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                {/* Info Note */}
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                    <p className="text-xs text-orange-800">
                                        <strong>Lưu ý:</strong> Tài khoản admin phụ sẽ có toàn quyền quản trị hệ thống. Vui lòng cấp quyền cẩn thận.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex space-x-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddAdminModalOpen(false)
                                            setAdminFormData({
                                                firstName: "",
                                                lastName: "",
                                                email: "",
                                                password: "",
                                                confirmPassword: "",
                                            })
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        disabled={adminFormLoading}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={adminFormLoading}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {adminFormLoading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Đang tạo...</span>
                                            </div>
                                        ) : (
                                            "Tạo tài khoản"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Recipe Modal */}
                <AddRecipeModal
                    isOpen={isRecipeModalOpen}
                    onClose={handleAddModalClose}
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
