import React from 'react';
import { Shield, Lock, Eye, Users, Settings, Bell, Cookie, RefreshCw, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Tại Kooka, chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn 
              khi bạn truy cập và sử dụng ứng dụng của chúng tôi. Chính sách này cung cấp chi tiết 
              về cách chúng tôi thu thập, sử dụng và bảo mật thông tin.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Section 1 */}
            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-orange-100 p-3 rounded-xl flex-shrink-0">
                  <Eye className="h-8 w-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Thông Tin Chúng Tôi Thu Thập
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Để cung cấp và cải thiện dịch vụ, Kooka thu thập thông tin từ người dùng 
                    thông qua nhiều hình thức, bao gồm:
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Thông Tin Cá Nhân
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Khi bạn đăng ký tài khoản, sử dụng chatbot AI, lưu công thức yêu thích, 
                      hoặc liên hệ với chúng tôi, chúng tôi có thể thu thập các thông tin như tên, 
                      địa chỉ email, ảnh đại diện và các thông tin khác mà bạn cung cấp.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                  <Settings className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Mục Đích Sử Dụng Thông Tin
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Thông tin được thu thập được sử dụng để:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                        Cung Cấp Dịch Vụ
                      </h3>
                      <p className="text-gray-600">
                        Sử dụng thông tin để cung cấp và duy trì các dịch vụ của Kooka, 
                        bao gồm tìm kiếm công thức, chatbot AI, lập kế hoạch bữa ăn và 
                        nâng cao trải nghiệm người dùng.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                        Giao Tiếp với Người Dùng
                      </h3>
                      <p className="text-gray-600">
                        Gửi các thông báo, bản tin, cập nhật công thức mới và các tính năng liên quan 
                        đến dịch vụ. Bạn có thể từ chối nhận các thông tin này bất kỳ lúc nào.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                        Phân Tích và Cải Thiện
                      </h3>
                      <p className="text-gray-600">
                        Sử dụng thông tin phi cá nhân để hiểu rõ hơn về hành vi của người dùng, 
                        cải thiện thuật toán AI và nâng cao chất lượng ứng dụng.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                        Bảo Mật
                      </h3>
                      <p className="text-gray-600">
                        Áp dụng các biện pháp để bảo vệ ứng dụng và người dùng khỏi các hành vi 
                        gian lận, đảm bảo an toàn thông tin và tuân thủ các yêu cầu pháp lý.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Chia Sẻ Thông Tin
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Kooka cam kết không bán, trao đổi hoặc chia sẻ thông tin cá nhân của bạn 
                    với bất kỳ bên thứ ba nào, ngoại trừ trong các trường hợp sau:
                  </p>
                  <div className="space-y-4">
                    <div className="border-l-4 border-orange-500 pl-6 py-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Với Sự Đồng Ý Của Bạn
                      </h3>
                      <p className="text-gray-600">
                        Chúng tôi chỉ chia sẻ thông tin cá nhân khi có sự đồng ý rõ ràng của bạn.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6 py-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Đối Tác và Nhà Cung Cấp Dịch Vụ
                      </h3>
                      <p className="text-gray-600">
                        Chia sẻ thông tin với các đối tác và nhà cung cấp dịch vụ AI tin cậy 
                        để hỗ trợ trong việc cung cấp tính năng chatbot, phân tích dữ liệu và 
                        cải thiện trải nghiệm người dùng.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-6 py-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Tuân Thủ Pháp Luật
                      </h3>
                      <p className="text-gray-600">
                        Kooka có thể tiết lộ thông tin cá nhân nếu được yêu cầu theo quy định 
                        pháp luật hoặc để bảo vệ quyền lợi, tài sản và an toàn của ứng dụng và người dùng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-8 lg:p-12 text-white">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4">
                    Bảo Mật Thông Tin Cá Nhân
                  </h2>
                  <p className="text-white/90 leading-relaxed mb-6">
                    Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức để bảo vệ thông tin cá nhân 
                    của bạn khỏi việc mất mát, lạm dụng, truy cập trái phép, tiết lộ và thay đổi.
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <p className="text-white/90 leading-relaxed">
                      Tuy nhiên, mặc dù chúng tôi luôn nỗ lực tối đa, không có phương pháp truyền tải 
                      hay lưu trữ nào là tuyệt đối an toàn. Kooka cam kết liên tục cải tiến các biện pháp 
                      bảo mật để bảo vệ thông tin của bạn.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Quyền Riêng Tư của Người Dùng
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Người dùng có quyền:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="bg-green-100 rounded-full p-1 mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-600 flex-1">
                        Truy cập, chỉnh sửa và xóa thông tin cá nhân của mình mà chúng tôi lưu giữ. 
                        Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email: 
                        <a href="mailto:support@kooka.com" className="text-orange-600 font-semibold hover:text-orange-700 ml-1">
                          support@kooka.com
                        </a>
                      </p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="bg-green-100 rounded-full p-1 mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-600 flex-1">
                        Từ chối nhận thông báo từ Kooka bất kỳ lúc nào thông qua tùy chọn trong 
                        email hoặc cài đặt tài khoản.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-yellow-100 p-3 rounded-xl flex-shrink-0">
                  <Cookie className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Cookies và Công Nghệ Tương Tự
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Kooka sử dụng cookies và các công nghệ tương tự để thu thập thông tin phi cá nhân 
                    về cách bạn sử dụng ứng dụng. Cookies giúp chúng tôi:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <Bell className="h-6 w-6 text-yellow-600 mb-2" />
                      <p className="text-gray-700 text-sm">
                        Cải thiện trải nghiệm người dùng bằng cách ghi nhớ sở thích của bạn
                      </p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <Settings className="h-6 w-6 text-yellow-600 mb-2" />
                      <p className="text-gray-700 text-sm">
                        Phân tích lưu lượng truy cập và hành vi của người dùng để cải thiện dịch vụ
                      </p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <Eye className="h-6 w-6 text-yellow-600 mb-2" />
                      <p className="text-gray-700 text-sm">
                        Cung cấp gợi ý công thức phù hợp dựa trên hoạt động của bạn
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4">
                    Bạn có thể điều chỉnh cài đặt cookies thông qua trình duyệt của mình hoặc tắt cookies nếu muốn.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-indigo-100 p-3 rounded-xl flex-shrink-0">
                  <RefreshCw className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Thay Đổi Chính Sách Riêng Tư
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Kooka có thể cập nhật Chính Sách Riêng Tư này để phù hợp với các quy định và 
                    chính sách nội bộ mới. Mọi thay đổi sẽ được thông báo trên ứng dụng và có hiệu lực 
                    ngay khi được đăng tải. Việc tiếp tục sử dụng ứng dụng sau khi có thay đổi đồng nghĩa 
                    với việc bạn chấp nhận các điều khoản mới.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-8 lg:p-12 text-white">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4">
                    Liên Hệ
                  </h2>
                  <p className="text-white/90 leading-relaxed text-lg">
                    Nếu có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến Chính Sách Riêng Tư này, 
                    vui lòng liên hệ với chúng tôi qua email: 
                    <a href="mailto:support@kooka.com" className="font-bold hover:underline ml-1">
                      support@kooka.com
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Cập nhật lần cuối: Tháng 12, 2025</p>
          <p className="text-gray-600 mt-2">© 2025 Kooka. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
