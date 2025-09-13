import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ChefHat } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#181e29] text-gray-300 pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-2">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Kooka</span>
          </div>
          <p className="mb-6 text-gray-400">
            Khám phá những công thức nấu ăn tuyệt vời với nguyên liệu bạn đã có sẵn tại nhà.
            Nấu ăn thông minh, tiết kiệm, ăn ngon hơn.
          </p>
          <div className="flex gap-4 text-gray-400">
            <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5 hover:text-orange-500 transition" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5 hover:text-orange-500 transition" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 hover:text-orange-500 transition" /></a>
            <a href="#" aria-label="YouTube"><Youtube className="w-5 h-5 hover:text-orange-500 transition" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Tất cả công thức</a></li>
            <li><a href="#" className="hover:text-white transition">Danh mục</a></li>
            <li><a href="#" className="hover:text-white transition">Nguyên liệu phổ biến</a></li>
            <li><a href="#" className="hover:text-white transition">Lên thực đơn</a></li>
            <li><a href="#" className="hover:text-white transition">Mẹo nấu ăn</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">Danh mục</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Bữa sáng</a></li>
            <li><a href="#" className="hover:text-white transition">Bữa trưa</a></li>
            <li><a href="#" className="hover:text-white transition">Bữa tối</a></li>
            <li><a href="#" className="hover:text-white transition">Tráng miệng</a></li>
            <li><a href="#" className="hover:text-white transition">Ăn chay</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2"><Mail className="w-5 h-5 text-orange-500" /> <span>hello@kooka.com</span></li>
            <li className="flex items-center gap-2"><Phone className="w-5 h-5 text-orange-500" /> <span>+1 (555) 123-4567</span></li>
            <li className="flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-500" /> <span>123 Đường Công Thức, Food City</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <div className="mb-4 md:mb-0">© 2025 Kooka. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">Chính sách bảo mật</a>
          <a href="#" className="hover:text-white transition">Điều khoản sử dụng</a>
          <a href="#" className="hover:text-white transition">Chính sách Cookie</a>
        </div>
      </div>
    </footer>
  );
}
