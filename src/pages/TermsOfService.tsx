import React from 'react';
import { FileText, Shield, UserCheck, AlertTriangle, RefreshCw, Mail } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <FileText className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Điều Khoản Sử Dụng
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Chào mừng bạn đến với Kooka – Ứng dụng hướng dẫn nấu ăn tích hợp AI. 
              Để đảm bảo trải nghiệm tốt nhất cho tất cả người dùng, Kooka xây dựng và duy trì 
              các điều khoản sử dụng dưới đây. Bằng việc truy cập và sử dụng dịch vụ của Kooka, 
              bạn đồng ý tuân thủ các điều khoản này.
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
                  <UserCheck className="h-8 w-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    1. Chấp Nhận Điều Khoản Sử Dụng
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Khi sử dụng dịch vụ của Kooka, bạn chấp nhận rằng bạn đã đọc, hiểu và đồng ý với 
                    các điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, 
                    vui lòng không tiếp tục truy cập hoặc sử dụng Kooka.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    2. Đăng Ký Tài Khoản
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Khi đăng ký tài khoản tại Kooka, bạn cam kết:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <span className="bg-blue-100 rounded-full p-1 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <p className="text-gray-600">Cung cấp thông tin chính xác, đầy đủ và luôn cập nhật.</p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-blue-100 rounded-full p-1 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <p className="text-gray-600">
                        Bảo mật thông tin đăng nhập của mình. Kooka không chịu trách nhiệm cho bất kỳ 
                        mất mát hoặc thiệt hại nào liên quan đến việc tiết lộ thông tin tài khoản.
                      </p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-blue-100 rounded-full p-1 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <p className="text-gray-600">
                        Không sử dụng tài khoản của mình để thực hiện các hành vi vi phạm pháp luật 
                        hoặc gây tổn hại cho Kooka và người dùng khác.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-red-100 p-3 rounded-xl flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    3. Hành Vi Bị Cấm
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    Khi sử dụng Kooka, bạn đồng ý không:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>
                      Đăng tải, chia sẻ hoặc phát tán bất kỳ nội dung nào vi phạm quyền sở hữu trí tuệ, 
                      pháp luật hoặc quyền riêng tư của người khác.
                    </li>
                    <li>
                      Thực hiện các hành vi gây hại cho hệ thống, cố gắng truy cập trái phép vào máy chủ 
                      hoặc tài khoản của người dùng khác.
                    </li>
                    <li>
                      Sử dụng Kooka với mục đích thương mại mà không có sự đồng ý bằng văn bản từ chúng tôi.
                    </li>
                    <li>
                      Sao chép, sửa đổi, hoặc phân phối nội dung công thức nấu ăn mà không có sự cho phép.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Sections 4-8 with updated styling */}
            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Bảo Mật Thông Tin</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Kooka cam kết bảo vệ thông tin cá nhân của bạn. Vui lòng tham khảo <a href="/privacy-policy" className="text-orange-600 font-semibold hover:text-orange-700">Chính Sách Riêng Tư</a> của chúng tôi để hiểu rõ cách chúng tôi thu thập, sử dụng và bảo mật thông tin cá nhân của bạn.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                  <RefreshCw className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Quyền Thay Đổi Dịch Vụ</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">Kooka có quyền:</p>
                  <ul className="space-y-3">
                    {['Thay đổi, cập nhật hoặc ngừng cung cấp bất kỳ công thức, nội dung hoặc dịch vụ nào trên nền tảng mà không cần thông báo trước.', 'Xóa bỏ hoặc tạm ngừng tài khoản của bạn nếu phát hiện hành vi vi phạm các điều khoản sử dụng hoặc các quy định pháp luật có liên quan.', 'Cải tiến và nâng cấp các tính năng AI chatbot và công cụ tìm kiếm để mang lại trải nghiệm tốt hơn cho người dùng.'].map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <span className="bg-purple-100 rounded-full p-1 mt-1 flex-shrink-0">
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <p className="text-gray-600">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-yellow-100 p-3 rounded-xl flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Miễn Trừ Trách Nhiệm</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">Kooka cam kết nỗ lực cung cấp dịch vụ với chất lượng tốt nhất, nhưng chúng tôi không chịu trách nhiệm về:</p>
                  <ul className="space-y-3">
                    {['Bất kỳ gián đoạn nào trong quá trình truy cập hoặc sự cố kỹ thuật.', 'Kết quả nấu ăn thực tế dựa trên công thức được cung cấp. Người dùng tự chịu trách nhiệm về việc thực hiện công thức.', 'Nội dung do người dùng khác hoặc bên thứ ba cung cấp.', 'Các phản hồi hoặc gợi ý từ AI chatbot có thể không hoàn toàn chính xác trong mọi trường hợp.', 'Các thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.'].map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <span className="text-yellow-600 mt-1">•</span>
                        <p className="text-gray-600">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-indigo-100 p-3 rounded-xl flex-shrink-0">
                  <RefreshCw className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Thay Đổi Điều Khoản Sử Dụng</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Chúng tôi có thể cập nhật điều khoản sử dụng theo thời gian để phù hợp với các thay đổi trong hoạt động và dịch vụ. Khi điều khoản thay đổi, chúng tôi sẽ đăng tải bản cập nhật lên trang web và gửi thông báo đến người dùng khi cần thiết. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn đồng ý với các điều khoản mới.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-8 lg:p-12 text-white">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4">8. Liên Hệ</h2>
                  <p className="text-white/90 leading-relaxed text-lg">
                    Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào liên quan đến các điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua email: 
                    <a href="mailto:support@kooka.com" className="text-orange-600 font-semibold hover:text-orange-700 ml-1">
                      support@kooka.com
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Cập nhật lần cuối: Tháng 12, 2025</p>
            <p className="mt-2">© 2025 Kooka. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
