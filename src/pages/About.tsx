import React from 'react';
import { ChefHat, Heart, Award, Clock, Lightbulb, Target, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

const About: React.FC = () => {

  const features = [
    {
      icon: ChefHat,
      title: 'Tìm Công Thức Bằng AI',
      description: 'Công nghệ AI thông minh phân tích nguyên liệu và gợi ý công thức phù hợp nhất.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Sparkles,
      title: 'Chatbot Hỗ Trợ 24/7',
      description: 'Trợ lý ảo AI sẵn sàng tư vấn, giải đáp mọi thắc mắc về nấu ăn bất cứ lúc nào.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Gợi Ý Cá Nhân Hóa',
      description: 'AI học hỏi sở thích của bạn để đưa ra những gợi ý món ăn phù hợp nhất.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Clock,
      title: 'Tiết Kiệm & Hiệu Quả',
      description: 'Tối ưu hóa nguyên liệu, giảm lãng phí và tiết kiệm thời gian nấu nướng.',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const stats = [
    { number: '100+', label: 'Công Thức', icon: ChefHat, color: 'from-orange-500 to-red-500' },
    { number: 'AI', label: 'Chatbot Thông Minh', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
    { number: '24/7', label: 'Hỗ Trợ', icon: Clock, color: 'from-pink-500 to-rose-500' },
    { number: '100%', label: 'Miễn Phí', icon: Heart, color: 'from-yellow-500 to-amber-500' }
  ];

  const values = [
    {
      icon: Sparkles,
      title: 'Công Nghệ AI',
      description: 'Ứng dụng trí tuệ nhân tạo để mang lại trải nghiệm nấu ăn thông minh',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Dễ Sử Dụng',
      description: 'Giao diện thân thiện, dễ dàng tìm kiếm và theo dõi công thức',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Học Tập & Phát Triển',
      description: 'Dự án khóa luận tốt nghiệp với mục tiêu ứng dụng thực tế',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Tối Ưu Hóa',
      description: 'Giảm lãng phí thực phẩm, tiết kiệm chi phí và thời gian',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Khởi Đầu Ý Tưởng',
      description: 'Bắt đầu nghiên cứu và phát triển đề tài khóa luận tốt nghiệp'
    },
    {
      year: '2025',
      title: 'Phát Triển Ứng Dụng',
      description: 'Xây dựng hệ thống tích hợp AI chatbot và tính năng tìm kiếm thông minh'
    },
    {
      year: 'Tương Lai',
      title: 'Hoàn Thiện & Mở Rộng',
      description: 'Tiếp tục cải tiến AI, mở rộng cơ sở dữ liệu công thức và tính năng mới'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-20 lg:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-8 animate-bounce-slow">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Heart className="h-16 w-16 text-white" fill="white" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
              Về Chúng Tôi
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent block mt-2">
                Kooka
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Chúng tôi đam mê giúp những người yêu thích nấu ăn tạo ra những bữa ăn tuyệt vời 
              với nguyên liệu họ đã có sẵn. Sứ mệnh của chúng tôi là giảm lãng phí thực phẩm, 
              tiết kiệm chi phí và truyền cảm hứng sáng tạo ẩm thực cho mọi gia đình.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg transform hover:scale-105">
                Khám Phá Ngay
              </button>
              <button className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-lg border-2 border-orange-500 transform hover:scale-105">
                Tìm Hiểu Thêm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Sứ Mệnh</h2>
              </div>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Kooka là dự án khóa luận tốt nghiệp với mục tiêu xây dựng ứng dụng web hỗ trợ 
                người dùng trong việc tìm kiếm và học cách nấu các món ăn thông qua công nghệ AI.
              </p>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Ứng dụng tích hợp AI chatbot thông minh giúp tư vấn, giải đáp thắc mắc về nấu ăn, 
                gợi ý công thức phù hợp với nguyên liệu sẵn có, đồng thời giúp người dùng tiết kiệm 
                thời gian và giảm lãng phí thực phẩm.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">AI Chatbot</h3>
                    <p className="text-gray-600">Trợ lý ảo thông minh hỗ trợ tư vấn nấu ăn 24/7</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <ChefHat className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Tìm Kiếm Thông Minh</h3>
                    <p className="text-gray-600">Gợi ý công thức dựa trên nguyên liệu có sẵn</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Ứng Dụng Thực Tế</h3>
                    <p className="text-gray-600">Giải pháp hữu ích cho người nấu ăn hàng ngày</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Cooking ingredients"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-3xl text-white shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Award className="h-12 w-12 mb-3" />
                <p className="font-bold text-2xl">Nền Tảng</p>
                <p className="text-lg opacity-90">Xuất Sắc</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Tính Năng Nổi Bật
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tính Năng Chính
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ứng dụng tích hợp công nghệ AI để mang lại trải nghiệm nấu ăn thông minh và tiện lợi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group hover:-translate-y-3 border border-gray-100"
                >
                  <div className={`bg-gradient-to-r ${feature.color} p-5 rounded-2xl inline-block mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Thành Tựu
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Những Con Số Ấn Tượng
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dự án khóa luận tốt nghiệp với công nghệ hiện đại và tính năng đa dạng
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`bg-gradient-to-r ${stat.color} p-6 rounded-3xl inline-block mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-semibold text-lg">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Giá Trị Cốt Lõi
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Điều Chúng Tôi Tin Tưởng
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className={`bg-gradient-to-r ${value.color} p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Hành Trình
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Câu Chuyện Của Chúng Tôi
            </h2>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 via-red-500 to-pink-500"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        {item.year}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
            <Sparkles className="h-16 w-16 text-white mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Trải Nghiệm Nấu Ăn Với AI
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Khám phá ứng dụng hướng dẫn nấu ăn tích hợp AI - Giải pháp thông minh cho mọi bữa ăn. 
              Tìm kiếm công thức, nhận tư vấn từ chatbot và nấu ăn dễ dàng hơn bao giờ hết!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-orange-600 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105">
                Bắt Đầu Ngay
              </button>
              <button className="bg-transparent text-white px-10 py-5 rounded-2xl hover:bg-white/20 transition-all duration-300 font-bold text-xl border-2 border-white shadow-2xl transform hover:scale-105">
                Xem Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
