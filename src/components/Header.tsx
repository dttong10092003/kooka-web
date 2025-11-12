import React from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  User,
  ChefHat,
  ChevronDown,
  LogOut,
  Settings,
  Star,
  Shield,
  Bell,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { clearProfile } from "../redux/slices/userSlice";

export default function Header() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const { token, user } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notificationTab, setNotificationTab] = React.useState<'recipes' | 'community'>('recipes');
  const [showAppDownload, setShowAppDownload] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const notificationRef = React.useRef<HTMLDivElement>(null);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);
  const appDownloadRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (appDownloadRef.current && !appDownloadRef.current.contains(event.target as Node)) {
        setShowAppDownload(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get avatar from either user or profile
  let avatarUrl = user?.avatar || profile?.avatar;


  // Fix Google avatar URL format and add size parameter
  if (avatarUrl && avatarUrl.includes('googleusercontent.com')) {
    // Ensure Google avatar has proper size parameter
    if (!avatarUrl.includes('=s')) {
      avatarUrl = avatarUrl + '=s200-c';
    }
  }

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearProfile());
    setShowUserDropdown(false);
    toast.success("Đăng xuất thành công!", { duration: 2500 });
    navigate("/");
  };

  const getUserInitials = (name?: string) =>
    (name ?? "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // 👉 Nếu đang ở trang Register, luôn hiển thị trạng thái chưa login
  const forceGuest = location.pathname === "/register";

  // Handler để kiểm tra đăng nhập trước khi vào Meal Planner
  const handleMealPlannerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!token || !user) {
      e.preventDefault();
      alert(t("header.loginRequired") || "Please login to access Meal Planner");
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        {/* Logo - chỉ hiện trên md trở lên */}
        <div className="flex items-center gap-2 md:flex hidden">
          <Link to="/">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center cursor-pointer">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
          </Link>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Kooka
          </span>
        </div>

        {/* Hamburger menu cho mobile - trái */}
        <div className="md:hidden flex items-center">
          <button
            className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Open menu"
          >
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation - desktop only */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={location.pathname === "/" ? "text-orange-500 font-medium" : "text-gray-600 hover:text-gray-900"}>{t("header.home")}</Link>
          <Link to="/recipes" className={location.pathname === "/recipes" ? "text-orange-500 font-medium" : "text-gray-600 hover:text-gray-900"}>{t("header.recipes")}</Link>
          <Link to="/meal-planner" onClick={handleMealPlannerClick} className={location.pathname === "/meal-planner" ? "text-orange-500 font-medium" : "text-gray-600 hover:text-gray-900"}>{t("header.mealPlanner")}</Link>
          <Link to="/categories" className={location.pathname === "/categories" ? "text-orange-500 font-medium" : "text-gray-600 hover:text-gray-900"}>{t("header.categories")}</Link>
          <Link to="/about" className={location.pathname === "/about" ? "text-orange-500 font-medium" : "text-gray-600 hover:text-gray-900"}>{t("header.about")}</Link>
        </nav>

        {/* Mobile menu drawer */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-[100] bg-black/40 md:hidden transition-opacity duration-300" onClick={() => setShowMobileMenu(false)}>
            <div className="fixed top-0 left-0 w-4/5 max-w-xs h-full bg-white shadow-xl flex flex-col p-6 gap-4 transition-transform duration-300 ease-out" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-6">
                <Link to="/" onClick={() => setShowMobileMenu(false)}>
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center cursor-pointer">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                </Link>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Kooka</span>
              </div>
              <Link to="/" className={`py-2 px-2 rounded-lg transition-colors ${location.pathname === "/" ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-orange-50"}`} onClick={() => { setShowAppDownload(false); setTimeout(() => setShowMobileMenu(false), 150); }}>{t("header.home")}</Link>
              <Link to="/recipes" className={`py-2 px-2 rounded-lg transition-colors ${location.pathname === "/recipes" ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-orange-50"}`} onClick={() => { setShowAppDownload(false); setTimeout(() => setShowMobileMenu(false), 150); }}>{t("header.recipes")}</Link>
              <Link to="/meal-planner" className={`py-2 px-2 rounded-lg transition-colors ${location.pathname === "/meal-planner" ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-orange-50"}`} onClick={e => { setShowAppDownload(false); handleMealPlannerClick(e as any); setTimeout(() => setShowMobileMenu(false), 150); }}>{t("header.mealPlanner")}</Link>
              <Link to="/categories" className={`py-2 px-2 rounded-lg transition-colors ${location.pathname === "/categories" ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-orange-50"}`} onClick={() => { setShowAppDownload(false); setTimeout(() => setShowMobileMenu(false), 150); }}>{t("header.categories")}</Link>
              <Link to="/about" className={`py-2 px-2 rounded-lg transition-colors ${location.pathname === "/about" ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-orange-50"}`} onClick={() => { setShowAppDownload(false); setTimeout(() => setShowMobileMenu(false), 150); }}>{t("header.about")}</Link>
              
              {/* Download App Section - Only on mobile when logged in */}
              {!forceGuest && token && user && location.pathname !== "/login" && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAppDownload(!showAppDownload);
                    }}
                    className="w-full py-2 px-2 rounded-lg text-gray-700 hover:bg-orange-50 flex items-center gap-2 justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.476 0H7.524A1.524 1.524 0 0 0 6 1.524v19.952A1.524 1.524 0 0 0 7.524 23h9.952A1.524 1.524 0 0 0 19 21.476V1.524A1.524 1.524 0 0 0 17.476 0zM18 21.477a.524.524 0 0 1-.524.523H14v-1h-3v1H7.524A.524.524 0 0 1 7 21.477V20h11zM18 19H7V3h11zm0-17H7v-.477A.524.524 0 0 1 7.524 1h9.952a.524.524 0 0 1 .524.523zm-7.8 5.7v7.6l6-3.8zm.8 1.453l3.705 2.347L11 13.847z" fill="#f97316" />
                        <path fill="none" d="M0 0h24v24H0z" />
                      </svg>
                      <span className="text-sm font-medium">Tải ứng dụng Kooka</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showAppDownload ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown content inside mobile menu */}
                  {showAppDownload && (
                    <div className="px-2 py-3 space-y-2 overflow-hidden transition-all duration-300 ease-in-out">
                      <p className="text-xs text-gray-600 mb-3">Cài đặt Kooka và khám phá hành trình nấu ăn ngay!</p>
                      
                      {/* iOS Button - Disabled */}
                      <button 
                        disabled
                        className="w-full flex items-center gap-3 py-2.5 px-3 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.52 12.46C16.508 11.8438 16.6682 11.2365 16.9827 10.7065C17.2972 10.1765 17.7534 9.74476 18.3 9.46C17.9558 8.98143 17.5063 8.5883 16.9862 8.31089C16.466 8.03349 15.8892 7.87923 15.3 7.86C14.03 7.76 12.65 8.6 12.14 8.6C11.63 8.6 10.37 7.9 9.40999 7.9C7.40999 7.9 5.29999 9.49 5.29999 12.66C5.30963 13.6481 5.48194 14.6279 5.80999 15.56C6.24999 16.84 7.89999 20.05 9.61999 20C10.52 20 11.16 19.36 12.33 19.36C13.5 19.36 14.05 20 15.06 20C16.79 20 18.29 17.05 18.72 15.74C18.0689 15.4737 17.5119 15.0195 17.1201 14.4353C16.7282 13.8511 16.5193 13.1634 16.52 12.46ZM14.52 6.59C14.8307 6.23965 15.065 5.82839 15.2079 5.38245C15.3508 4.93651 15.3992 4.46569 15.35 4C14.4163 4.10239 13.5539 4.54785 12.93 5.25C12.6074 5.58991 12.3583 5.99266 12.1983 6.43312C12.0383 6.87358 11.9708 7.34229 12 7.81C12.4842 7.82361 12.9646 7.71974 13.3999 7.50728C13.8353 7.29482 14.2127 6.98009 14.5 6.59H14.52Z" fill="#9CA3AF" />
                        </svg>
                        <span className="text-sm font-medium text-gray-400">iOS</span>
                      </button>

                      {/* Android Button */}
                      <button className="w-full flex items-center gap-3 py-2.5 px-3 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="7" y="2" width="10" height="20" rx="2" stroke="#6B7280" strokeWidth="1.5" fill="none" />
                          <line x1="7" y1="18" x2="17" y2="18" stroke="#6B7280" strokeWidth="1.5" />
                          <circle cx="12" cy="20" r="0.5" fill="#6B7280" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">Android</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Download App - Only show when logged in and on desktop */}
          {!forceGuest && token && user && location.pathname !== "/login" && (
            <div className="relative hidden md:block" ref={appDownloadRef}>
              <button
                onClick={() => setShowAppDownload(!showAppDownload)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                title="Tải ứng dụng Kooka"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.476 0H7.524A1.524 1.524 0 0 0 6 1.524v19.952A1.524 1.524 0 0 0 7.524 23h9.952A1.524 1.524 0 0 0 19 21.476V1.524A1.524 1.524 0 0 0 17.476 0zM18 21.477a.524.524 0 0 1-.524.523H14v-1h-3v1H7.524A.524.524 0 0 1 7 21.477V20h11zM18 19H7V3h11zm0-17H7v-.477A.524.524 0 0 1 7.524 1h9.952a.524.524 0 0 1 .524.523zm-7.8 5.7v7.6l6-3.8zm.8 1.453l3.705 2.347L11 13.847z" fill="#f97316" />
                    <path fill="none" d="M0 0h24v24H0z" />
                  </svg>
                </div>
                <div className="hidden lg:flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-gray-600">Tải ứng dụng</span>
                  <span className="text-xs font-semibold text-gray-900">Kooka</span>
                </div>
              </button>

              {/* App Download Dropdown */}
              {showAppDownload && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 p-3">
                  {/* Header with Logo */}
                  <div className="flex items-start gap-2 mb-3">
                    <img
                      src="/kookalogo.png"
                      alt="Kooka Logo"
                      className="w-12 h-12 rounded-xl"
                    />
                    <p className="text-xs text-gray-700 leading-relaxed pt-1">
                      Cài đặt Kooka và khám phá hành trình nấu ăn ngay!
                    </p>
                  </div>

                  {/* Platform Options */}
                  <div className="flex gap-2">
                    {/* iOS Button - Disabled (Coming Soon) */}
                    <button
                      disabled
                      className="flex-1 flex items-center gap-2 py-2 px-3 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.52 12.46C16.508 11.8438 16.6682 11.2365 16.9827 10.7065C17.2972 10.1765 17.7534 9.74476 18.3 9.46C17.9558 8.98143 17.5063 8.5883 16.9862 8.31089C16.466 8.03349 15.8892 7.87923 15.3 7.86C14.03 7.76 12.65 8.6 12.14 8.6C11.63 8.6 10.37 7.9 9.40999 7.9C7.40999 7.9 5.29999 9.49 5.29999 12.66C5.30963 13.6481 5.48194 14.6279 5.80999 15.56C6.24999 16.84 7.89999 20.05 9.61999 20C10.52 20 11.16 19.36 12.33 19.36C13.5 19.36 14.05 20 15.06 20C16.79 20 18.29 17.05 18.72 15.74C18.0689 15.4737 17.5119 15.0195 17.1201 14.4353C16.7282 13.8511 16.5193 13.1634 16.52 12.46ZM14.52 6.59C14.8307 6.23965 15.065 5.82839 15.2079 5.38245C15.3508 4.93651 15.3992 4.46569 15.35 4C14.4163 4.10239 13.5539 4.54785 12.93 5.25C12.6074 5.58991 12.3583 5.99266 12.1983 6.43312C12.0383 6.87358 11.9708 7.34229 12 7.81C12.4842 7.82361 12.9646 7.71974 13.3999 7.50728C13.8353 7.29482 14.2127 6.98009 14.5 6.59H14.52Z" fill="#9CA3AF" />
                      </svg>
                      <span className="text-[11px] font-semibold text-gray-400">iOS</span>
                    </button>

                    {/* Android Button */}
                    <button className="flex-1 flex items-center gap-2 py-2 px-3 border-2 border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="7" y="2" width="10" height="20" rx="2" stroke="#6B7280" strokeWidth="1.5" fill="none" />
                        <line x1="7" y1="18" x2="17" y2="18" stroke="#6B7280" strokeWidth="1.5" />
                        <circle cx="12" cy="20" r="0.5" fill="#6B7280" />
                      </svg>
                      <span className="text-[11px] font-semibold text-gray-900">Android</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications - Only show when logged in */}
          {!forceGuest && token && user && location.pathname !== "/login" && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-full bg-white hover:bg-gray-100 transition-all duration-200"
              >
                <Bell className="w-5 h-5 text-black" />
                {/* Notification badge */}
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  {/* Mobile Overlay */}
                  <div className="md:hidden fixed inset-0 bg-black/40 z-[60]" onClick={() => setShowNotifications(false)} />
                  
                  {/* Dropdown Content */}
                  <div className="fixed md:absolute right-0 md:right-0 bottom-0 md:bottom-auto md:top-full md:mt-3 left-0 md:left-auto w-full md:w-96 max-h-[85vh] md:max-h-[600px] bg-white md:rounded-xl rounded-t-2xl shadow-2xl border border-gray-200 overflow-hidden z-[70] animate-in fade-in slide-in-from-bottom md:slide-in-from-top-2 duration-200">
                  {/* Header with Tabs */}
                  <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setNotificationTab('recipes')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${notificationTab === 'recipes'
                          ? 'bg-white text-indigo-900'
                          : 'text-white/80 hover:text-white hover:bg-white/15'
                          }`}
                      >
                        Công thức
                      </button>
                      <button
                        onClick={() => setNotificationTab('community')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${notificationTab === 'community'
                          ? 'bg-white text-indigo-900'
                          : 'text-white/80 hover:text-white hover:bg-white/15'
                          }`}
                      >
                        Cộng đồng
                      </button>
                    </div>
                    <button
                      className="text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/15 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-base">✓</span>
                      <span>Đã đọc</span>
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {notificationTab === 'recipes' ? (
                      <>
                        {/* Recipe Notifications */}
                        <div className="px-5 py-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 transition-colors group">
                          <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"
                                alt="Recipe"
                                className="w-14 h-14 rounded-lg object-cover ring-2 ring-gray-200 group-hover:ring-orange-300 transition-all"
                              />
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">⚡</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 leading-relaxed">
                                <strong className="text-gray-900 font-semibold">Bún Chả Hà Nội</strong> vừa được thêm vào danh sách món ăn mới
                              </p>
                              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                5 ngày trước
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 transition-colors group">
                          <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100"
                                alt="Recipe"
                                className="w-14 h-14 rounded-lg object-cover ring-2 ring-gray-200 group-hover:ring-orange-300 transition-all"
                              />
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✨</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 leading-relaxed">
                                <strong className="text-gray-900 font-semibold">Phở Bò Truyền Thống</strong> có công thức mới được cập nhật
                              </p>
                              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                1 tuần trước
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 transition-colors group">
                          <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100"
                                alt="Recipe"
                                className="w-14 h-14 rounded-lg object-cover ring-2 ring-gray-200 group-hover:ring-orange-300 transition-all"
                              />
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">🎉</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 leading-relaxed">
                                <strong className="text-gray-900 font-semibold">Bánh Xèo Miền Tây</strong> vừa ra mắt trên Kooka
                              </p>
                              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                1 tháng trước
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 transition-colors group">
                          <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100"
                                alt="Recipe"
                                className="w-14 h-14 rounded-lg object-cover ring-2 ring-gray-200 group-hover:ring-orange-300 transition-all"
                              />
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">📹</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 leading-relaxed">
                                <strong className="text-gray-900 font-semibold">Cơm Tấm Sườn Bì</strong> có video hướng dẫn chi tiết
                              </p>
                              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                2 tháng trước
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-4 hover:bg-orange-50 cursor-pointer transition-colors group">
                          <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100"
                                alt="Recipe"
                                className="w-14 h-14 rounded-lg object-cover ring-2 ring-gray-200 group-hover:ring-orange-300 transition-all"
                              />
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">💡</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 leading-relaxed">
                                <strong className="text-gray-900 font-semibold">Gỏi Cuốn Tôm Thịt</strong> có mẹo hay được cập nhật
                              </p>
                              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                3 tháng trước
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Community Tab - Empty State */
                      <div className="px-5 py-20 text-center">
                        <Bell className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Chưa có thông báo cộng đồng
                        </h3>
                        <p className="text-sm text-gray-500">
                          Các thông báo về bình luận, lượt thích sẽ hiển thị tại đây
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3.5 bg-gradient-to-r from-gray-50 to-orange-50 border-t border-gray-200">
                    <button className="w-full text-sm text-orange-600 hover:text-orange-700 font-semibold py-2 rounded-lg hover:bg-white/60 transition-all">
                      Xem tất cả thông báo →
                    </button>
                  </div>
                </div>
                </>
              )}
            </div>
          )}

          {/* User state */}
          {!forceGuest && token && user && location.pathname !== "/login" ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center overflow-hidden relative ring-2 ring-orange-200 hover:ring-orange-300">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallbackDiv) {
                          fallbackDiv.style.display = 'flex';
                        }
                      }}

                    />
                  ) : null}
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-semibold"
                    style={{ display: avatarUrl ? 'none' : 'flex' }}
                  >
                    {getUserInitials(user.username)}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>

              {/* Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallbackDiv) {
                              fallbackDiv.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ display: avatarUrl ? 'none' : 'flex' }}
                      >
                        {getUserInitials(user.username)}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      {user.email && (
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      )}
                    </div>
                  </div>

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
                    type="button"
                    onClick={() => { setShowUserDropdown(false); setLogoutConfirmOpen(true); }}
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
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
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
                  setLogoutConfirmOpen(false);
                  handleLogout();
                }}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
