import { Search, Heart, User, ChefHat } from "lucide-react"
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Kooka</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-orange-500 font-medium">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Recipes
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Categories
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            About
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="button" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
            <Search className="w-5 h-5" />
          </button>
          <button type="button" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
            <Heart className="w-5 h-5" />
          </button>
          <Link to="/login" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-white px-4 py-2 rounded-lg flex items-center">
            <User className="w-4 h-4 mr-2" />
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}
