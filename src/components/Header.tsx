import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  User,
  ChefHat,
  ChevronDown,
  LogOut,
  Settings,
  Star,
  Shield,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

export default function Header() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { token, user } = useSelector((state: RootState) => state.auth);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
  };

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center cursor-pointer">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
          </Link>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Kooka
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-orange-500 font-medium">
            {t("header.home")}
          </Link>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            {t("header.recipes")}
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            {t("header.categories")}
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            {t("header.about")}
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* User state */}
          {token && user && location.pathname !== "/login" ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 cursor-pointer"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  {getUserInitials(user.username)}
                </div>
                <span className="hidden sm:inline">{user.username}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  {/* Header user info */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserInitials(user.username)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      {user.email && (
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Menu items */}
                  <Link
                    to="/my-profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" /> {t("header.authProfile")}
                  </Link>
                  <Link
                    to="/my-favorites"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Heart className="h-4 w-4" /> {t("header.authFavorites")}
                  </Link>

                  <Link
                    to="/my-reviews"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Star className="h-4 w-4" /> {t("header.authReviews")}
                  </Link>

                  {/* Admin menu */}
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Shield className="h-4 w-4" /> {t("header.authAdmin")}
                    </Link>
                  )}

                  <div className="border-t border-gray-100 my-1" />
                  <Link
                    to="/my-settings"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" /> {t("header.authSettings")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> {t("header.authLogout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
              {t("header.signin")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
