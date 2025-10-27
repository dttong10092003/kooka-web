import { Link } from "react-router-dom"
import { ChefHat, BookOpen, Users, Search, TrendingUp, Clock, Star, ArrowRight } from "lucide-react"
import PopularRecipes from "../components/PopularRecipes"

const Home = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-20 px-4 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <ChefHat className="w-5 h-5" />
                                <span className="text-sm font-medium">Nền tảng chia sẻ công thức nấu ăn</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Khám phá nghệ thuật
                                <span className="block mt-2">nấu nướng mỗi ngày</span>
                            </h1>
                            
                            <p className="text-xl mb-8 text-white/90">
                                Hàng nghìn công thức đa dạng từ các đầu bếp tài năng. 
                                Tìm món ăn yêu thích và tạo bữa ăn hoàn hảo cho gia đình.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link
                                    to="/recipes"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Search className="w-5 h-5" />
                                    Tìm công thức ngay
                                </Link>
                                <Link
                                    to="/about"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
                                >
                                    Tìm hiểu thêm
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Right Content - Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <BookOpen className="w-10 h-10 mb-4" />
                                <div className="text-4xl font-bold mb-2">10K+</div>
                                <div className="text-white/80">Công thức</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <Users className="w-10 h-10 mb-4" />
                                <div className="text-4xl font-bold mb-2">50K+</div>
                                <div className="text-white/80">Người dùng</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <ChefHat className="w-10 h-10 mb-4" />
                                <div className="text-4xl font-bold mb-2">1K+</div>
                                <div className="text-white/80">Đầu bếp</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <Star className="w-10 h-10 mb-4" />
                                <div className="text-4xl font-bold mb-2">100K+</div>
                                <div className="text-white/80">Đánh giá</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Tại sao chọn Kooka?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Chúng tôi mang đến trải nghiệm nấu ăn tuyệt vời với những tính năng độc đáo
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Tìm kiếm thông minh</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tìm công thức theo tên món ăn hoặc nguyên liệu có sẵn. 
                                Hệ thống AI giúp bạn tìm món phù hợp nhất.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                                <Clock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Lập kế hoạch bữa ăn</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tạo thực đơn tuần với các công thức yêu thích. 
                                Quản lý bữa ăn dễ dàng và khoa học.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Cộng đồng sôi động</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Chia sẻ công thức, đánh giá và học hỏi từ cộng đồng 
                                yêu thích nấu ăn trên toàn quốc.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Recipes */}
            <PopularRecipes />

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Bắt đầu hành trình nấu nướng của bạn
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        Tham gia cộng đồng hàng nghìn người yêu thích nấu ăn. 
                        Khám phá, chia sẻ và tạo nên những món ăn tuyệt vời.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Đăng ký miễn phí
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/recipes"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
                        >
                            <Search className="w-5 h-5" />
                            Khám phá công thức
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;