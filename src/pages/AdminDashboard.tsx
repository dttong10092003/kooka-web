import type React from "react"
import { useState } from "react"
import {
    BarChart3,
    Users,
    ChefHat,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Download,
    Upload,
    Settings,
    Bell,
    Star,
    Eye,
    MessageSquare,
    Activity,
    LogOut,
} from "lucide-react"

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("overview")
    const [searchQuery, setSearchQuery] = useState("")

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
            value: "2,847",
            change: "+12%",
            trend: "up",
            icon: ChefHat,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Active Users",
            value: "18,392",
            change: "+8%",
            trend: "up",
            icon: Users,
            color: "from-green-500 to-green-600",
        },
        {
            title: "Recipe Views",
            value: "847K",
            change: "+23%",
            trend: "up",
            icon: Eye,
            color: "from-purple-500 to-purple-600",
        },
        {
            title: "User Reviews",
            value: "12,847",
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

    const recentUsers = [
        {
            id: 1,
            name: "John Smith",
            email: "john@example.com",
            joinDate: "2025-01-10",
            recipes: 12,
            status: "Active",
        },
        {
            id: 2,
            name: "Emma Wilson",
            email: "emma@example.com",
            joinDate: "2025-01-09",
            recipes: 8,
            status: "Active",
        },
        {
            id: 3,
            name: "Michael Brown",
            email: "michael@example.com",
            joinDate: "2025-01-08",
            recipes: 15,
            status: "Inactive",
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

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full overflow-y-auto">
                {/* Logo/Brand */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <ChefHat className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                            Kooka Admin
                        </span>
                    </div>
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
                        onClick={() => console.log("Logging out...")}
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
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {tabs.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                    <Bell className="h-6 w-6" />
                                </button>
                                <button className="bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
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

                                {/* User Activity Chart */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Download className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <Activity className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                                            <p className="text-gray-600">Activity chart would go here</p>
                                        </div>
                                    </div>
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
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                                                        <p className="text-sm text-gray-600">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                        {user.status}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">{user.recipes} recipes</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recipes Tab */}
                    {activeTab === "recipes" && (
                        <div className="space-y-6">
                            {/* Search and Filters */}
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
                                        <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
                                            <Filter className="h-5 w-5" />
                                            <span>Filter</span>
                                        </button>
                                        <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
                                            <Upload className="h-5 w-5" />
                                            <span>Import</span>
                                        </button>
                                        <button className="bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
                                            <Plus className="h-5 w-5" />
                                            <span>Add Recipe</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recipes Table */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Recipe
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Author
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Views
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Rating
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentRecipes.map((recipe) => (
                                                <tr key={recipe.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{recipe.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{recipe.author}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recipe.status)}`}
                                                        >
                                                            {recipe.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{recipe.views}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                            <span className="text-sm text-gray-600">{recipe.rating}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{recipe.date}</td>
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
                                            {recentUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-orange-500 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                                                                <span className="text-white font-medium text-sm">
                                                                    {user.name
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </span>
                                                            </div>
                                                            <div className="font-medium text-gray-900">{user.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.joinDate}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.recipes}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                                                        >
                                                            {user.status}
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
                                                        defaultValue="SuperCook"
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
            </div>
        </div>
    )
}

export default AdminDashboard
